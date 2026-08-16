import type { OrderStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getAdminDashboardStats() {
  const today = startOfToday();

  const [
    ordersToday,
    ordersAll,
    revenueAgg,
    customers,
    products,
    recentOrdersRaw,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        number: true,
        total: true,
        currency: true,
        status: true,
        createdAt: true,
        firstName: true,
        lastName: true,
      },
    }),
  ]);

  return {
    ordersToday,
    ordersAll,
    revenue: revenueAgg._sum.total ?? 0,
    customers,
    products,
    recentOrders: recentOrdersRaw.map((o) => ({
      id: o.id,
      number: o.number,
      total: o.total,
      currency: o.currency,
      status: o.status,
      placedAt: o.createdAt.toISOString(),
      customerName: `${o.firstName} ${o.lastName}`.trim(),
    })),
  };
}

export async function getAdminProducts(q?: string) {
  const trimmed = q?.trim();
  const where = trimmed
    ? {
        OR: [
          { name: { contains: trimmed, mode: "insensitive" as const } },
          { slug: { contains: trimmed, mode: "insensitive" as const } },
          {
            brand: {
              name: { contains: trimmed, mode: "insensitive" as const },
            },
          },
        ],
      }
    : {};

  const products = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      archived: true,
      currency: true,
      brand: { select: { name: true } },
      variants: {
        select: {
          price: true,
          sizes: { select: { stock: true } },
        },
      },
    },
  });

  return products.map((p) => {
    const priceFrom = p.variants.length
      ? Math.min(...p.variants.map((v) => v.price))
      : 0;
    const totalStock = p.variants.reduce(
      (sum, v) => sum + v.sizes.reduce((s, sz) => s + sz.stock, 0),
      0,
    );

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brandName: p.brand.name,
      currency: p.currency,
      priceFrom,
      totalStock,
      archived: p.archived,
      variantCount: p.variants.length,
    };
  });
}

function euSizeSortKey(size: string): number {
  const n = Number.parseInt(size.replace(/^EU\s*/i, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export async function getAdminProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: { select: { id: true, name: true, slug: true } },
      variants: {
        orderBy: { createdAt: "asc" },
        include: {
          sizes: true,
        },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      sizes: [...v.sizes].sort(
        (a, b) => euSizeSortKey(a.size) - euSizeSortKey(b.size),
      ),
    })),
  };
}

export async function getAdminBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

export async function getAdminOrders(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      status: true,
      total: true,
      currency: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      email: true,
      _count: { select: { items: true } },
    },
  });
}

export async function getAdminOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          phone: true,
        },
      },
      items: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          productName: true,
          brandName: true,
          color: true,
          size: true,
          imageUrl: true,
        },
      },
    },
  });
}

export async function getAdminCustomers() {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: `${u.name} ${u.lastName}`.trim(),
    ordersCount: u._count.orders,
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function getAdminCustomer(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      phone: true,
      address: true,
      city: true,
      postalCode: true,
      country: true,
      createdAt: true,
      role: true,
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          number: true,
          status: true,
          total: true,
          currency: true,
          createdAt: true,
          _count: { select: { items: true } },
        },
      },
    },
  });

  if (!user || user.role !== "CUSTOMER") return null;

  return {
    id: user.id,
    email: user.email,
    name: `${user.name} ${user.lastName}`.trim(),
    phone: user.phone,
    address: user.address,
    city: user.city,
    postalCode: user.postalCode,
    country: user.country,
    createdAt: user.createdAt.toISOString(),
    orders: user.orders.map((o) => ({
      id: o.id,
      number: o.number,
      status: o.status,
      total: o.total,
      currency: o.currency,
      placedAt: o.createdAt.toISOString(),
      itemCount: o._count.items,
    })),
  };
}

export async function getAdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: `${u.name} ${u.lastName}`.trim(),
    role: u.role,
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function getAdminActivities(take = 50) {
  const rows = await prisma.adminActivity.findMany({
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      message: true,
      meta: true,
      createdAt: true,
      actor: {
        select: { name: true, lastName: true, email: true },
      },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    entityType: r.entityType,
    entityId: r.entityId,
    message: r.message,
    meta: r.meta,
    createdAt: r.createdAt.toISOString(),
    actorName: `${r.actor.name} ${r.actor.lastName}`.trim(),
    actorEmail: r.actor.email,
  }));
}
