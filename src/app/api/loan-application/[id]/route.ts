import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import LoanApplication from "@/models/LoanApplication";
import { authOptions } from "../../auth/[...nextauth]/route";

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
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { amount, purpose } = await req.json();
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
        { message: "Cannot edit a non-pending application" },
        { status: 400 }
      );
    }

    loanApplication.amount = amount;
    loanApplication.purpose = purpose;

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
