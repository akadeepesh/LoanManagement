import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import LoanApplication from "@/models/LoanApplication";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "user") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, purpose } = await req.json();
    await dbConnect();

    const loanApplication = await LoanApplication.create({
      userId: session.user.id,
      amount,
      purpose,
    });

    return NextResponse.json(loanApplication, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    let query = {};
    let populateOptions = { path: "userId", select: "name email" };

    if (session.user.role === "user") {
      query = { userId: session.user.id };
    } else if (session.user.role === "admin") {
      populateOptions = {
        ...populateOptions,
        path: "verifiedBy",
        select: "name",
      };
    }

    const loanApplications = await LoanApplication.find(query)
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    return NextResponse.json(loanApplications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
