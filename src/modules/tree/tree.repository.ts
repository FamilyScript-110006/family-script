
import { Prisma, Tree, TreeNode, Relationship, FamilyProfile, OrganizationProfile, TribeProfile, Invitation, TreeMember } from "@prisma/client";

import { PrismaClient } from "@prisma/client";
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
 import { TreeMemberRole, InvitationStatus } from "@prisma/client";

export class TreeRepository {
    constructor(private readonly db: PrismaClient) {}
  /**
   * Create a new tree
   */
  async create(data: Prisma.TreeCreateInput): Promise<Tree> {
    return this.db.tree.create({
      data,
    });
  }

  /**
   * Find tree by ID
   */
  async findById(id: string): Promise<Tree | null> {
    return this.db.tree.findUnique({
      where: { id },
    });
  }

  /**
   * Find tree by slug
   */
  async findBySlug(slug: string): Promise<Tree | null> {
    return this.db.tree.findUnique({
      where: { slug },
    });
  }

  /**
   * Find all trees owned by a user
   */
  async findByOwner(ownerId: string): Promise<Tree[]> {
    return this.db.tree.findMany({
      where: {
        ownerId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Update tree
   */
  async update(
    id: string,
    data: Prisma.TreeUpdateInput
  ): Promise<Tree> {
    return this.db.tree.update({
      where: { id },
      data,
    });
  }

  /**
   * Soft delete tree
   */
  async softDelete(id: string): Promise<Tree> {
    return this.db.tree.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restore tree
   */
  async restore(id: string): Promise<Tree> {
    return this.db.tree.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  /**
   * Check if slug exists
   */
  async slugExists(slug: string): Promise<boolean> {
    const tree = await this.db.tree.findUnique({
      where: { slug },
      select: { id: true },
    });

    return !!tree;
  }

  /**
   * Check if tree exists
   */
  async exists(id: string): Promise<boolean> {
    const tree = await this.db.tree.findUnique({
      where: { id },
      select: { id: true },
    });

    return !!tree;
  }

  /**
   * Create a node (person) inside a tree
   */
  async createNode(
    treeId: string,
    data: Prisma.TreeNodeCreateWithoutTreeInput
  ): Promise<TreeNode> {
    return this.db.treeNode.create({
      data: {
        ...data,
        tree: {
          connect: { id: treeId },
        },
      },
    });
  }
 
  /**
   * Find a node by ID, scoped to a tree
   */
  async findNodeById(treeId: string, nodeId: string): Promise<TreeNode | null> {
    return this.db.treeNode.findFirst({
      where: {
        id: nodeId,
        treeId,
        deletedAt: null,
      },
    });
  }
 
  /**
   * Find all nodes belonging to a tree
   */
  async findNodesByTree(treeId: string): Promise<TreeNode[]> {
    return this.db.treeNode.findMany({
      where: {
        treeId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
 
  /**
   * Update a node
   */
  async updateNode(
    nodeId: string,
    data: Prisma.TreeNodeUpdateInput
  ): Promise<TreeNode> {
    return this.db.treeNode.update({
      where: { id: nodeId },
      data,
    });
  }
 
  /**
   * Soft delete a node
   */
  async softDeleteNode(nodeId: string): Promise<TreeNode> {
    return this.db.treeNode.update({
      where: { id: nodeId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
 
    /**
   * Create a relationship between two nodes in a tree
   */
  async createRelationship(
    treeId: string,
    createdById: string,
    data: Omit<Prisma.RelationshipCreateInput, "tree" | "createdBy" | "sourceNode" | "targetNode"> & {
      sourceNodeId: string;
      targetNodeId: string;
    }
  ): Promise<Relationship> {
    const { sourceNodeId, targetNodeId, ...rest } = data;
 
    return this.db.relationship.create({
      data: {
        ...rest,
        tree: { connect: { id: treeId } },
        sourceNode: { connect: { id: sourceNodeId } },
        targetNode: { connect: { id: targetNodeId } },
        createdBy: { connect: { id: createdById } },
      },
    });
  }
 
  /**
   * Find a relationship by ID, scoped to a tree
   */
  async findRelationshipById(
    treeId: string,
    relationshipId: string
  ): Promise<Relationship | null> {
    return this.db.relationship.findFirst({
      where: {
        id: relationshipId,
        treeId,
      },
    });
  }
 
  /**
   * Find all relationships in a tree, optionally filtered to
   * ones involving a specific node (as source or target)
   */
  async findRelationshipsByTree(
    treeId: string,
    nodeId?: string
  ): Promise<Relationship[]> {
    return this.db.relationship.findMany({
      where: {
        treeId,
        ...(nodeId
          ? {
              OR: [{ sourceNodeId: nodeId }, { targetNodeId: nodeId }],
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
 
  /**
   * Check whether a relationship of this exact type already exists
   * between the two nodes (in either direction)
   */
  async relationshipExists(
    sourceNodeId: string,
    targetNodeId: string,
    type: Prisma.RelationshipCreateInput["type"]
  ): Promise<boolean> {
    const relationship = await this.db.relationship.findFirst({
      where: {
        type,
        OR: [
          { sourceNodeId, targetNodeId },
          { sourceNodeId: targetNodeId, targetNodeId: sourceNodeId },
        ],
      },
      select: { id: true },
    });
 
    return !!relationship;
  }
 
  /**
   * Update a relationship
   */
  async updateRelationship(
    relationshipId: string,
    data: Prisma.RelationshipUpdateInput
  ): Promise<Relationship> {
    return this.db.relationship.update({
      where: { id: relationshipId },
      data,
    });
  }
 
  /**
   * Delete a relationship (hard delete — relationships don't carry
   * their own soft-delete field in the schema)
   */
  async deleteRelationship(relationshipId: string): Promise<Relationship> {
    return this.db.relationship.delete({
      where: { id: relationshipId },
    });
  }

  /**
   * Fetch a node's family profile (if it has one yet)
   */
  async findFamilyProfileByNodeId(nodeId: string): Promise<FamilyProfile | null> {
    return this.db.familyProfile.findUnique({
      where: { nodeId },
    });
  }
 
  /**
   * Create or update a node's family profile in one call.
   * Most nodes won't have a profile row until the first update,
   * so this upserts rather than requiring a separate "create" step.
   */
  async upsertFamilyProfile(
  nodeId: string,
  data: Omit<Prisma.FamilyProfileUncheckedCreateInput, "nodeId">
  ): Promise<FamilyProfile> {
    return this.db.familyProfile.upsert({
      where: { nodeId },
      create: {
        ...data,
        nodeId,
      },
      update: data,
    });
  }

  // ===== ORGANIZATION PROFILE =====
 
  async findOrganizationProfileByNodeId(nodeId: string): Promise<OrganizationProfile | null> {
    return this.db.organizationProfile.findUnique({
      where: { nodeId },
    });
  }
 
  async upsertOrganizationProfile(
  nodeId: string,
  data: Omit<Prisma.OrganizationProfileUncheckedCreateInput, "nodeId">
): Promise<OrganizationProfile> {
    return this.db.organizationProfile.upsert({
      where: { nodeId },
      create: {
        ...data,
        nodeId,
      },
      update: data,
    });
  }
 
  // ===== TRIBE PROFILE =====
 
  async findTribeProfileByNodeId(nodeId: string): Promise<TribeProfile | null> {
    return this.db.tribeProfile.findUnique({
      where: { nodeId },
    });
  }
 
  async upsertTribeProfile(
  nodeId: string,
  data: Omit<Prisma.TribeProfileUncheckedCreateInput, "nodeId">
): Promise<TribeProfile> {
    return this.db.tribeProfile.upsert({
      where: { nodeId },
      create: {
        ...data,
        nodeId,
      },
      update: data,
    });
  }

  // ===== INVITATIONS =====
 
  async createInvitation(
    treeId: string,
    invitedById: string,
    data: {
      email: string;
      role: Prisma.InvitationCreateInput["role"];
      token: string;
      expiresAt: Date;
    }
  ): Promise<Invitation> {
    return this.db.invitation.create({
      data: {
        ...data,
        tree: { connect: { id: treeId } },
        invitedBy: { connect: { id: invitedById } },
      },
    });
  }
 
  async findInvitationByToken(token: string): Promise<Invitation | null> {
    return this.db.invitation.findUnique({
      where: { token },
    });
  }
 
  async updateInvitationStatus(
    invitationId: string,
    data: Prisma.InvitationUpdateInput
  ): Promise<Invitation> {
    return this.db.invitation.update({
      where: { id: invitationId },
      data,
    });
  }
 
  // ===== TREE MEMBERS (CONTRIBUTORS) =====
 
  async createTreeMember(
    treeId: string,
    userId: string,
    role: Prisma.TreeMemberCreateInput["role"]
  ): Promise<TreeMember> {
    return this.db.treeMember.create({
      data: {
        role,
        tree: { connect: { id: treeId } },
        user: { connect: { id: userId } },
      },
    });
  }
 
  async findTreeMember(treeId: string, userId: string): Promise<TreeMember | null> {
    return this.db.treeMember.findUnique({
      where: {
        treeId_userId: { treeId, userId },
      },
    });
  }
 
  async findTreeMembersByTree(treeId: string): Promise<TreeMember[]> {
    return this.db.treeMember.findMany({
      where: { treeId },
      orderBy: { joinedAt: "asc" },
    });
  }
 
  async updateTreeMemberRole(
    treeId: string,
    userId: string,
    role: Prisma.TreeMemberUpdateInput["role"]
  ): Promise<TreeMember> {
    return this.db.treeMember.update({
      where: {
        treeId_userId: { treeId, userId },
      },
      data: { role },
    });
  }
 
  async deleteTreeMember(treeId: string, userId: string): Promise<TreeMember> {
    return this.db.treeMember.delete({
      where: {
        treeId_userId: { treeId, userId },
      },
    });
  }

  async findNodesWithDates(treeId: string): Promise<TreeNode[]> {
    return this.db.treeNode.findMany({
      where: {
        treeId,
        deletedAt: null,
        OR: [{ birthDate: { not: null } }, { deathDate: { not: null } }],
      },
    });
  }
 
  /**
   * SPOUSE/PARTNER relationships that have a startDate set, for
   * "marriage/union" timeline events.
   */
  async findRelationshipsWithStartDate(treeId: string): Promise<Relationship[]> {
    return this.db.relationship.findMany({
      where: {
        treeId,
        startDate: { not: null },
        type: { in: ["SPOUSE", "PARTNER"] },
      },
      include: {
        sourceNode: true,
        targetNode: true,
      },
    });
  }
 
  /**
   * Simplified node list for graph visualization — just what's
   * needed to draw a box (id + display label).
   */
  async findNodesForGraph(
  treeId: string,
): Promise<Pick<TreeNode, "id" | "firstName" | "lastName" | "displayName">[]> {
  return this.db.treeNode.findMany({
    where: { treeId, deletedAt: null },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
    },
  });
}
 
  /**
   * Counts used for the analytics endpoint. Run together so the
   * service layer can Promise.all them.
   */
  async countNodes(treeId: string): Promise<number> {
    return this.db.treeNode.count({
      where: { treeId, deletedAt: null },
    });
  }
 
  async countRelationships(treeId: string): Promise<number> {
    return this.db.relationship.count({
      where: { treeId },
    });
  }
 
  async countContributors(treeId: string): Promise<number> {
    return this.db.treeMember.count({
      where: { treeId },
    });
  }
 
  async countStories(treeId: string): Promise<number> {
    return this.db.story.count({
      where: { treeId, deletedAt: null },
    });
  }

}
