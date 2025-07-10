import { auth } from '@/auth';
import { getConditionsByUserId } from '@/lib/db/condition';
import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    keyword,
    categoryId,
    subcategoryId,
    childCategoryId,
    finalCategoryId,
    selectedItems,
    selectedConditions,
    priceMin,
    priceMax,
  } = await req.json();

  const session = await auth();

  console.log(session?.user);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.condition.create({
    data: {
      keyword,
      categoryId,
      subcategoryId,
      childCategoryId,
      finalCategoryId,
      itemCategoryIds: selectedItems,
      conditionStatusIds: selectedConditions,
      priceMin,
      priceMax,
      userId: session?.user?.id,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getConditionsByUserId(session.user.id);

  return NextResponse.json(data);
}
