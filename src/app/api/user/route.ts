import { createConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();
    const sql = "SELECT * FROM user";
    const [rows] = await db.query(sql);

    if (rows.length === 0) {
      return NextResponse.json({ message: "No users found" });
    }

    return NextResponse.json(rows);

  } catch (error) {
    console.error("Error while fetching data:", error);
    return NextResponse.json({ error: error || "An error occurred" }, { status: 500 });
  }
}