import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import LoanApplication from "@/models/LoanApplication";
import User from "@/models/User"; // Make sure to import the User model
import { authOptions } from "@/lib/authoptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    let query = {};

    if (session.user.role === "user") {
      query = { userId: session.user.id };
    }

    const loanApplications = await LoanApplication.find(query)
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    // Fetch all verifiers and admins in one query
    const verifiersAndAdmins = await User.find({
      role: { $in: ["verifier", "admin"] },
    })
      .select("_id name email")
      .lean();

    // Create a map of verifier and admin IDs to their objects
    const verifierAdminMap = new Map(
      verifiersAndAdmins.map((v) => [v._id.toString(), v])
    );

    const populatedApplications = await Promise.all(
      loanApplications.map(async (app) => {
        const user = await User.findById(app.userId)
          .select("name email")
          .lean();

        let verifiedBy = null;
        if (app.verifiedBy) {
          verifiedBy = verifierAdminMap.get(app.verifiedBy.toString()) || null;
        }

        return {
          ...app,
          userId: user,
          verifiedBy: verifiedBy,
          status: app.status, // Ensure status is included
        };
      })
    );

    return NextResponse.json(populatedApplications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

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
