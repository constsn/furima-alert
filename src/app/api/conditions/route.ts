import { auth } from '@/auth';
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
    brandId,
    priceMin,
    priceMax,
  } = await req.json();

  if (brandId.trim() !== '' && typeof brandId !== 'string') {
    return NextResponse.json(
      { error: 'brandId が無効です。' },
      { status: 400 }
    );
  }

  const regex = /^[0-9]+(,[0-9]+)*$/;
  if (!regex.test(brandId)) {
    return NextResponse.json(
      { error: 'brandId が無効です。半角数字とカンマのみ指定してください。' },
      { status: 400 }
    );
  }

  const brandIdArray = brandId
    .split(',')
    .map((id: string) => parseInt(id, 10))
    .filter((id: number) => !isNaN(id));

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
      brandId: brandIdArray,
      priceMin,
      priceMax,
      userId: session?.user?.id,
    },
  });

  return NextResponse.json({ ok: true });
}
