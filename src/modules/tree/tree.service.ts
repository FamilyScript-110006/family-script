// src/modules/tree/tree.service.ts

import slugify from "slugify";


import { TreeRepository } from "./tree.repository";
import { CreateTreeInput, UpdateTreeInput, CreateTreeNodeInput, UpdateTreeNodeInput } from "./tree.types";
import {
  TreeAlreadyExistsError,
  TreeNotFoundError,
  TreeNodeNotFoundError
} from "./tree.errors";
import { RELATIONSHIP_TYPES_BY_TREE_TYPE } from "./tree.constants";
import { CreateRelationshipInput, UpdateRelationshipInput } from "./tree.types";
import {
  RelationshipNotFoundError,
  InvalidRelationshipTypeError,
  NodeNotInTreeError,
  RelationshipAlreadyExistsError
} from "./tree.errors";
import { UpdateFamilyProfileInput } from "./tree.types";
import { InvalidTreeTypeForProfileError } from "./tree.errors";
import { TreeType } from "@prisma/client";
import { UpdateOrganizationProfileInput, UpdateTribeProfileInput } from "./tree.types";

import crypto from "crypto";
import {
  InviteContributorInput,
  UpdateContributorRoleInput,
} from "./tree.types";
import {
  InvitationNotFoundError,
  InvitationExpiredError,
  InvitationAlreadyProcessedError,
  ContributorNotFoundError,
  ContributorAlreadyExistsError,
} from "./tree.errors";
import { Tree, TreeMemberRole, InvitationStatus } from "@prisma/client";
import { canInviteMembers, canManageMembers } from "./tree.permissions";
import { InsufficientPermissionsError } from "./tree.errors";
import { TimelineEvent, GraphNode, GraphEdge, TreeAnalytics } from "./tree.validator";
import { DerivedRelationshipsRequireFamilyTreeError } from "./tree.errors";
import { deriveRelationships, DerivedRelationship } from "./relationship-deriver";



export class TreeService {
  constructor(private readonly treeRepository: TreeRepository) {}

  /**
   * Creates a tree, derives a stable slug from the tree name,
   * and assigns the current user as the owner.
   */
  async createTree(data: CreateTreeInput, ownerId: string) {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const slugExists = await this.treeRepository.slugExists(slug);

    if (slugExists) {
      throw new TreeAlreadyExistsError(data.name);
    }

    return this.treeRepository.create({
      ...data,
      slug,
      owner: {
        connect: {
          id: ownerId,
        },
      },
    });
  }

  /**
   * Loads a tree by its database ID.
   *
   * userId is currently accepted so this method can be used
   * for service-level access checks.
   */
  async getTreeById(treeId: string, userId: string) {
    const tree = await this.treeRepository.findById(treeId);

    if (!tree) {
      throw new TreeNotFoundError();
    }

    return tree;
  }

  /**
   * Loads a tree by slug for public or route-based lookups.
   */
  async getTreeBySlug(slug: string) {
    const tree = await this.treeRepository.findBySlug(slug);

    if (!tree) {
      throw new TreeNotFoundError();
    }

    return tree;
  }

  /**
   * Returns all trees owned by a user.
   */
  async getUserTrees(ownerId: string) {
    return this.treeRepository.findByOwner(ownerId);
  }

  /**
   * Updates editable tree fields.
   *
   * First verifies that the tree exists and that the
   * current user is passed into the access-check layer.
   */
  async updateTree(
    id: string,
    userId: string,
    data: UpdateTreeInput
  ) {
    await this.getTreeById(id, userId);

    return this.treeRepository.update(id, data);
  }

  /**
   * Marks the tree as archived so it is hidden from
   * normal use without removing the database record.
   */
  async archiveTree(id: string) {
    await this.getTreeById(id, "");

    return this.treeRepository.update(id, {
      isArchived: true,
    });
  }

  /**
   * Reverses an archive operation by restoring the tree.
   */
  async restoreTree(id: string) {
    await this.getTreeById(id, "");

    return this.treeRepository.restore(id);
  }

  /**
   * Soft deletes a tree so the record can potentially
   * be recovered later.
   */
  async deleteTree(treeId: string, userId: string) {
    await this.getTreeById(treeId, userId);

    return this.treeRepository.softDelete(treeId);
  }

  /**
   * Adds a node (person) to a tree.
   * Confirms the tree exists first so nodes can't be attached to
   * a tree that was never created (or has since been deleted).
   */
  async addTreeNode(treeId: string, userId: string, data: CreateTreeNodeInput) {
    await this.getTreeById(treeId, userId);
 
    return this.treeRepository.createNode(treeId, data);
  }
 
  /**
   * Loads a single node, scoped to its tree.
   */
  async getTreeNodeById(treeId: string, nodeId: string) {
    const node = await this.treeRepository.findNodeById(treeId, nodeId);
 
    if (!node) {
      throw new TreeNodeNotFoundError();
    }
 
    return node;
  }
 
  /**
   * Returns all nodes for a tree.
   */
  async getTreeNodes(treeId: string, userId: string) {
    await this.getTreeById(treeId, userId);
 
    return this.treeRepository.findNodesByTree(treeId);
  }
 
  /**
   * Updates editable node fields.
   */
  async updateTreeNode(
    treeId: string,
    nodeId: string,
    data: UpdateTreeNodeInput
  ) {
    await this.getTreeNodeById(treeId, nodeId);
 
    return this.treeRepository.updateNode(nodeId, data);
  }
 
  /**
   * Soft deletes a node so the record can potentially be
   * recovered later.
   */
  async deleteTreeNode(treeId: string, nodeId: string) {
    await this.getTreeNodeById(treeId, nodeId);
 
    return this.treeRepository.softDeleteNode(nodeId);
  }

  /**
   * Creates a relationship between two nodes in a tree.
   *
   * Validates, in order:
   * 1. The tree exists
   * 2. Both nodes exist and actually belong to this tree
   * 3. The relationship type is valid for this tree's type
   *    (e.g. rejects MANAGER inside a FAMILY tree)
   * 4. The same relationship doesn't already exist
   */
  async createRelationship(
    treeId: string,
    userId: string,
    data: CreateRelationshipInput
  ) {
    const tree = await this.getTreeById(treeId, userId);
 
    const allowedTypes = RELATIONSHIP_TYPES_BY_TREE_TYPE[tree.type];
    if (!allowedTypes.includes(data.type)) {
      throw new InvalidRelationshipTypeError(data.type, tree.type);
    }
 
    const [sourceNode, targetNode] = await Promise.all([
      this.treeRepository.findNodeById(treeId, data.sourceNodeId),
      this.treeRepository.findNodeById(treeId, data.targetNodeId),
    ]);
 
    if (!sourceNode || !targetNode) {
      throw new NodeNotInTreeError();
    }
 
    const alreadyExists = await this.treeRepository.relationshipExists(
      data.sourceNodeId,
      data.targetNodeId,
      data.type
    );
 
    if (alreadyExists) {
      throw new RelationshipAlreadyExistsError();
    }
 
    return this.treeRepository.createRelationship(treeId, userId, data);
  }
 
  /**
   * Loads a single relationship, scoped to its tree.
   */
  async getRelationshipById(treeId: string, relationshipId: string) {
    const relationship = await this.treeRepository.findRelationshipById(
      treeId,
      relationshipId
    );
 
    if (!relationship) {
      throw new RelationshipNotFoundError();
    }
 
    return relationship;
  }
 
  /**
   * Returns all relationships for a tree, optionally filtered
   * to those involving a specific node.
   */
  async getTreeRelationships(treeId: string, userId: string, nodeId?: string) {
    await this.getTreeById(treeId, userId);
 
    return this.treeRepository.findRelationshipsByTree(treeId, nodeId);
  }
 
  /**
   * Updates an existing relationship (status/dates/notes only —
   * changing source/target/type is treated as delete + recreate).
   */
  async updateRelationship(
    treeId: string,
    relationshipId: string,
    data: UpdateRelationshipInput
  ) {
    await this.getRelationshipById(treeId, relationshipId);
 
    return this.treeRepository.updateRelationship(relationshipId, data);
  }
 
  /**
   * Deletes a relationship.
   */
  async deleteRelationship(treeId: string, relationshipId: string) {
    await this.getRelationshipById(treeId, relationshipId);
 
    return this.treeRepository.deleteRelationship(relationshipId);
  }

  /**
   * Fetches a node's family profile.
   * Validates the tree is actually FAMILY type before doing
   * anything else — a profile shouldn't be readable on an
   * ORGANIZATION or TRIBE tree's node.
   */
  async getFamilyProfile(treeId: string, userId: string, nodeId: string) {
    const tree = await this.getTreeById(treeId, userId);
 
    if (tree.type !== TreeType.FAMILY) {
      throw new InvalidTreeTypeForProfileError(TreeType.FAMILY, tree.type);
    }
 
    await this.getTreeNodeById(treeId, nodeId);
 
    return this.treeRepository.findFamilyProfileByNodeId(nodeId);
  }
 
  /**
   * Creates or updates a node's family profile.
   */
  async updateFamilyProfile(
    treeId: string,
    userId: string,
    nodeId: string,
    data: UpdateFamilyProfileInput
  ) {
    const tree = await this.getTreeById(treeId, userId);
 
    if (tree.type !== TreeType.FAMILY) {
      throw new InvalidTreeTypeForProfileError(TreeType.FAMILY, tree.type);
    }
 
    await this.getTreeNodeById(treeId, nodeId);
 
    return this.treeRepository.upsertFamilyProfile(nodeId, data);
  }

   // ===== ORGANIZATION PROFILE =====
 
  async getOrganizationProfile(treeId: string, userId: string, nodeId: string) {
    const tree = await this.getTreeById(treeId, userId);
 
    if (tree.type !== TreeType.ORGANIZATION) {
      throw new InvalidTreeTypeForProfileError(TreeType.ORGANIZATION, tree.type);
    }
 
    await this.getTreeNodeById(treeId, nodeId);
 
    return this.treeRepository.findOrganizationProfileByNodeId(nodeId);
  }
 
  async updateOrganizationProfile(
    treeId: string,
    userId: string,
    nodeId: string,
    data: UpdateOrganizationProfileInput
  ) {
    const tree = await this.getTreeById(treeId, userId);
 
    if (tree.type !== TreeType.ORGANIZATION) {
      throw new InvalidTreeTypeForProfileError(TreeType.ORGANIZATION, tree.type);
    }
 
    await this.getTreeNodeById(treeId, nodeId);
 
    return this.treeRepository.upsertOrganizationProfile(nodeId, data);
  }
 
  // ===== TRIBE PROFILE =====
 
  async getTribeProfile(treeId: string, userId: string, nodeId: string) {
    const tree = await this.getTreeById(treeId, userId);
 
    if (tree.type !== TreeType.TRIBE) {
      throw new InvalidTreeTypeForProfileError(TreeType.TRIBE, tree.type);
    }
 
    await this.getTreeNodeById(treeId, nodeId);
 
    return this.treeRepository.findTribeProfileByNodeId(nodeId);
  }
 
  async updateTribeProfile(
    treeId: string,
    userId: string,
    nodeId: string,
    data: UpdateTribeProfileInput
  ) {
    const tree = await this.getTreeById(treeId, userId);
 
    if (tree.type !== TreeType.TRIBE) {
      throw new InvalidTreeTypeForProfileError(TreeType.TRIBE, tree.type);
    }
 
    await this.getTreeNodeById(treeId, nodeId);
 
    return this.treeRepository.upsertTribeProfile(nodeId, data);
  }
  
  private async resolveMemberRole(
    tree: Tree,
    userId: string
  ): Promise<TreeMemberRole | null> {
    if (tree.ownerId === userId) {
      return TreeMemberRole.OWNER;
    }
 
    const member = await this.treeRepository.findTreeMember(tree.id, userId);
    return member?.role ?? null;
  }
 
  /**
   * Makes sure the tree owner has an actual TreeMember row, so they
   * show up in contributor lists like everyone else. Trees created
   * before this existed won't have one yet — this backfills it
   * the first time it's needed, instead of requiring a migration.
   */
  private async ensureOwnerMembership(tree: Tree) {
    const existing = await this.treeRepository.findTreeMember(tree.id, tree.ownerId);
 
    if (!existing) {
      await this.treeRepository.createTreeMember(
        tree.id,
        tree.ownerId,
        TreeMemberRole.OWNER
      );
    }
  }
 
  /**
   * Creates an invitation for someone to join a tree as a contributor.
   * Only OWNER/ADMIN can invite.
   */
  async inviteContributor(
    treeId: string,
    invitedById: string,
    data: InviteContributorInput
  ) {
    const tree = await this.getTreeById(treeId, invitedById);
 
    const role = await this.resolveMemberRole(tree, invitedById);
    if (!role || !canInviteMembers(role)) {
      throw new InsufficientPermissionsError("invite contributors");
    }
 
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
 
    const invitation = await this.treeRepository.createInvitation(treeId, invitedById, {
      email: data.email,
      role: data.role ?? TreeMemberRole.VIEWER,
      token,
      expiresAt,
    });
 
    // TODO: wire up real email delivery. Logging for now, same
    // pattern as sendVerificationEmail in config/auth.ts.
    console.info(
      `Tree invitation for ${data.email}: /trees/invitations/${token}/accept`
    );
 
    return invitation;
  }
 
  /**
   * Accepts an invitation, turning it into a TreeMember for the
   * accepting user.
   */
  async acceptInvitation(token: string, userId: string) {
    const invitation = await this.treeRepository.findInvitationByToken(token);
 
    if (!invitation) {
      throw new InvitationNotFoundError();
    }
 
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new InvitationAlreadyProcessedError(invitation.status);
    }
 
    if (invitation.expiresAt < new Date()) {
      await this.treeRepository.updateInvitationStatus(invitation.id, {
        status: InvitationStatus.EXPIRED,
      });
      throw new InvitationExpiredError();
    }
 
    const existingMember = await this.treeRepository.findTreeMember(
      invitation.treeId,
      userId
    );
 
    if (existingMember) {
      throw new ContributorAlreadyExistsError();
    }
 
    const [member] = await Promise.all([
      this.treeRepository.createTreeMember(invitation.treeId, userId, invitation.role),
      this.treeRepository.updateInvitationStatus(invitation.id, {
        status: InvitationStatus.ACCEPTED,
        acceptedAt: new Date(),
        invitedUser: { connect: { id: userId } },
      }),
    ]);
 
    return member;
  }
 
  /**
   * Lists all contributors (tree members) on a tree, including
   * the owner (backfilled automatically if missing).
   */
  async getContributors(treeId: string, userId: string) {
    const tree = await this.getTreeById(treeId, userId);
 
    await this.ensureOwnerMembership(tree);
 
    return this.treeRepository.findTreeMembersByTree(treeId);
  }
 
  /**
   * Updates a contributor's role. Only OWNER/ADMIN can do this.
   */
  async updateContributorRole(
    treeId: string,
    userId: string,
    targetUserId: string,
    data: UpdateContributorRoleInput
  ) {
    const tree = await this.getTreeById(treeId, userId);
 
    const role = await this.resolveMemberRole(tree, userId);
    if (!role || !canManageMembers(role)) {
      throw new InsufficientPermissionsError("manage contributor roles");
    }
 
    const member = await this.treeRepository.findTreeMember(treeId, targetUserId);
    if (!member) {
      throw new ContributorNotFoundError();
    }
 
    return this.treeRepository.updateTreeMemberRole(treeId, targetUserId, data.role);
  }
 
  /**
   * Removes a contributor from a tree. Only OWNER/ADMIN can do this.
   */
  async removeContributor(treeId: string, userId: string, targetUserId: string) {
    const tree = await this.getTreeById(treeId, userId);
 
    const role = await this.resolveMemberRole(tree, userId);
    if (!role || !canManageMembers(role)) {
      throw new InsufficientPermissionsError("remove contributors");
    }
 
    const member = await this.treeRepository.findTreeMember(treeId, targetUserId);
    if (!member) {
      throw new ContributorNotFoundError();
    }
 
    return this.treeRepository.deleteTreeMember(treeId, targetUserId);
  }

  /**
   * Builds a chronological timeline of birth/death dates and
   * SPOUSE/PARTNER relationship start dates, optionally bounded
   * by a from/to range.
   */
  async getTreeTimeline(
    treeId: string,
    userId: string,
    range: { from?: Date; to?: Date }
  ): Promise<TimelineEvent[]> {
    await this.getTreeById(treeId, userId);
 
    const [nodesWithDates, relationshipsWithDates] = await Promise.all([
      this.treeRepository.findNodesWithDates(treeId),
      this.treeRepository.findRelationshipsWithStartDate(treeId),
    ]);
 
    const events: TimelineEvent[] = [];
 
    for (const node of nodesWithDates) {
      const displayName =
        node.displayName ?? `${node.firstName} ${node.lastName}`.trim();
 
      if (node.birthDate) {
        events.push({
          date: node.birthDate,
          title: `Birth of ${displayName}`,
          nodeId: node.id,
        });
      }
 
      if (node.deathDate) {
        events.push({
          date: node.deathDate,
          title: `Death of ${displayName}`,
          nodeId: node.id,
        });
      }
    }
 
    for (const relationship of relationshipsWithDates) {
      // sourceNode/targetNode are included via the repository query
      const source = (relationship as any).sourceNode;
      const target = (relationship as any).targetNode;
 
      const sourceName =
        source?.displayName ?? `${source?.firstName ?? ""} ${source?.lastName ?? ""}`.trim();
      const targetName =
        target?.displayName ?? `${target?.firstName ?? ""} ${target?.lastName ?? ""}`.trim();
 
      if (relationship.startDate) {
        events.push({
          date: relationship.startDate,
          title: `${sourceName} & ${targetName} became ${relationship.type.toLowerCase()}s`,
          nodeId: relationship.sourceNodeId,
        });
      }
    }
 
    const filtered = events.filter((event) => {
      if (range.from && event.date < range.from) return false;
      if (range.to && event.date > range.to) return false;
      return true;
    });
 
    return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
 
  /**
   * Returns nodes/edges shaped for graph visualization.
   */
  async getTreeGraph(treeId: string, userId: string) {
    await this.getTreeById(treeId, userId);
 
    const [nodes, relationships] = await Promise.all([
      this.treeRepository.findNodesForGraph(treeId),
      this.treeRepository.findRelationshipsByTree(treeId),
    ]);
 
    const graphNodes: GraphNode[] = nodes.map((node) => ({
      id: node.id,
      label: node.displayName ?? `${node.firstName} ${node.lastName}`.trim(),
    }));
 
    const graphEdges: GraphEdge[] = relationships.map((rel) => ({
      id: rel.id,
      source: rel.sourceNodeId,
      target: rel.targetNodeId,
      type: rel.type,
    }));
 
    return { nodes: graphNodes, edges: graphEdges };
  }
 
  /**
   * Aggregate counts for the analytics endpoint.
   * booksPublished is always 0 for now — the Book module doesn't
   * exist yet, so there's nothing real to count.
   */
  async getTreeAnalytics(treeId: string, userId: string): Promise<TreeAnalytics> {
    await this.getTreeById(treeId, userId);
 
    const [memberCount, relationshipCount, contributorCount, storiesGenerated] =
      await Promise.all([
        this.treeRepository.countNodes(treeId),
        this.treeRepository.countRelationships(treeId),
        this.treeRepository.countContributors(treeId),
        this.treeRepository.countStories(treeId),
      ]);
 
    return {
      memberCount,
      relationshipCount,
      contributorCount,
      storiesGenerated,
      booksPublished: 0, // TODO: wire up once the Book module exists
    };
  }

  /**
   * Computes genealogical labels (grandparent, cousin, aunt/uncle,
   * in-law, ...) from a node to every other node in the tree.
   * Only supported on FAMILY trees — the relationship types
   * available on ORGANIZATION/TRIBE trees don't form a family graph.
   */
  async getDerivedRelationships(
    treeId: string,
    userId: string,
    nodeId: string
  ): Promise<DerivedRelationship[]> {
    const tree = await this.getTreeById(treeId, userId);

    if (tree.type !== TreeType.FAMILY) {
      throw new DerivedRelationshipsRequireFamilyTreeError(tree.type);
    }

    await this.getTreeNodeById(treeId, nodeId);

    const [nodes, relationships] = await Promise.all([
      this.treeRepository.findNodesByTree(treeId),
      this.treeRepository.findRelationshipsByTree(treeId),
    ]);

    return deriveRelationships(nodeId, nodes, relationships);
  }

}