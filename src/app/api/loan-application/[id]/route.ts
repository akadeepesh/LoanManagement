import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import LoanApplication from "@/models/LoanApplication";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { status } = await req.json();
    await dbConnect();

    const loanApplication = await LoanApplication.findById(id);

    if (!loanApplication) {
      return NextResponse.json(
        { message: "Loan application not found" },
        { status: 404 }
      );
    }

    if (
      session.user.role === "user" &&
      loanApplication.userId.toString() !== session.user.id
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "verifier" || session.user.role === "admin") {
      loanApplication.status = status;
      loanApplication.verifiedBy = new mongoose.Types.ObjectId(session.user.id);
    } else if (
      session.user.role === "user" &&
      loanApplication.status === "pending"
    ) {
      loanApplication.set(await req.json());
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await loanApplication.save();

    return NextResponse.json(loanApplication);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "user" && session.user.role !== "admin")
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    await dbConnect();

    const loanApplication = await LoanApplication.findById(id);

    if (!loanApplication) {
      return NextResponse.json(
        { message: "Loan application not found" },
        { status: 404 }
      );
    }

    if (
      session.user.role === "user" &&
      loanApplication.userId.toString() !== session.user.id
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await LoanApplication.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Loan application deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
