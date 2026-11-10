import { auth } from "@/lib/auth/server";

const proxy = auth.handler();

type CatchAllRouteContext = {
  params: Promise<{ all: string[] }>;
};

const adaptRouteParams = async (params: Promise<{ all: string[] }>) => ({
  path: (await params).all,
});

export const GET = async (
  request: Request,
  context: CatchAllRouteContext,
) => {
  return proxy.GET(request, {
    params: adaptRouteParams(context.params),
  });
};

export const POST = async (
  request: Request,
  context: CatchAllRouteContext,
) => {
  return proxy.POST(request, {
    params: adaptRouteParams(context.params),
  });
};

export const PUT = async (
  request: Request,
  context: CatchAllRouteContext,
) => {
  return proxy.PUT(request, {
    params: adaptRouteParams(context.params),
  });
};

export const PATCH = async (
  request: Request,
  context: CatchAllRouteContext,
) => {
  return proxy.PATCH(request, {
    params: adaptRouteParams(context.params),
  });
};

export const DELETE = async (
  request: Request,
  context: CatchAllRouteContext,
) => {
  return proxy.DELETE(request, {
    params: adaptRouteParams(context.params),
  });
};