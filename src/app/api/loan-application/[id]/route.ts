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
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const loanApplication = await LoanApplication.findById(id);

    if (!loanApplication) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    if (session.user.role === "user") {
      if (loanApplication.userId.toString() !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (loanApplication.status !== "pending") {
        return NextResponse.json(
          { message: "Can only edit pending applications" },
          { status: 400 }
        );
      }

      const { amount, purpose } = body;
      if (typeof amount !== "number" || amount <= 0) {
        return NextResponse.json(
          { message: "Amount must be a positive number" },
          { status: 400 }
        );
      }
      if (typeof purpose !== "string" || purpose.trim() === "") {
        return NextResponse.json(
          { message: "Purpose must be a non-empty string" },
          { status: 400 }
        );
      }

      const updatedApplication = await LoanApplication.findByIdAndUpdate(
        id,
        { amount, purpose, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate("userId", "name email");

      return NextResponse.json(updatedApplication);
    } else if (["verifier", "admin"].includes(session.user.role as string)) {
      const { status } = body;
      if (
        typeof status !== "string" ||
        !["approved", "rejected", "pending"].includes(status)
      ) {
        return NextResponse.json(
          { message: "Status must be 'approved', 'rejected', or 'pending'" },
          { status: 400 }
        );
      }

      const updatedApplication = await LoanApplication.findByIdAndUpdate(
        id,
        {
          status,
          verifiedBy: session.user.id,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      )
        .populate("userId", "name email")
        .populate("verifiedBy", "name email");

      return NextResponse.json(updatedApplication);
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
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
