import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import LoanApplication from "@/models/LoanApplication";
import { authOptions } from "@/lib/authoptions";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    await dbConnect();

    const loanApplication = await LoanApplication.findById(id).populate(
      "userId",
      "name email"
    );

    if (!loanApplication) {
      return NextResponse.json(
        { message: "Loan application not found" },
        { status: 404 }
      );
    }

    if (
      session.user.role === "user" &&
      loanApplication.userId._id.toString() !== session.user.id
    ) {
      console.log("User not authorized to access this loan application");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Returning loan application");
    return NextResponse.json(loanApplication);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !["verifier", "admin"].includes(session.user.role as string)
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { status } = await req.json();

  try {
    await dbConnect();

    const updatedApplication = await LoanApplication.findByIdAndUpdate(
      id,
      {
        status,
        verifiedBy: session.user.id,
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("verifiedBy", "name email");

    if (!updatedApplication) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedApplication);
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
  if (!session) {
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

    if (session.user.role === "user" && loanApplication.status !== "pending") {
      return NextResponse.json(
        { message: "Cannot delete a non-pending application" },
        { status: 400 }
      );
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
