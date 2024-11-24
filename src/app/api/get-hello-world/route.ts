import { NextResponse } from "next/server";

export const GET = () => {
  return new NextResponse("New Hello World!");
};
