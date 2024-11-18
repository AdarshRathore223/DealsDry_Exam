import { createConnection } from "@/app/lib/db";

// Disable Next.js body parser to handle FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fundSource,
      expenseDate,
      category,
      head,
      remark,
      vendor,
      amount,
      reference,
      isReimburseable,
      reimbursementSource,
      reimbursementDate,
      comment,
      mimeType,
      newFilename,
      originalName
    } = body;

    if (process.env.NEXT_PUBLIC_DEBUG_MODE==="true")
      console.log("Received form data:", body);

    const db = await createConnection();

    const query = `
      INSERT INTO user (
        FundSource,
        ExpenseDate,
        Category,
        Head,
        Remark,
        PaidTo,
        Amount,
        RefrenceID,
        Reimberseable,
        ReimberseSource,
        ReimberseDate,
        Comment,
        MimeType,
        OriginalName,
        NewFilename
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    if (process.env.NEXT_PUBLIC_DEBUG_MODE ==="true"){

        console.log("Executing query:", query);
        console.log("Query parameters:", [
            fundSource,
            expenseDate,
            category,
            head,
            remark,
            vendor,
            amount,
            reference,
            isReimburseable,
            reimbursementSource,
            reimbursementDate,
            comment,
            mimeType,
            originalName,
            newFilename,
        ]);
    }

    const [result] = await db.execute(query, [
        fundSource,
        expenseDate,
        category,
        head,
        remark,
        vendor,
        amount,
        reference,
        isReimburseable,
        reimbursementSource,
        reimbursementDate,
        comment,
        mimeType,
        originalName,
        newFilename,
    ]);

    return new Response(
      JSON.stringify({ message: "Form submitted successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Details: ", error);
    return new Response(
      JSON.stringify({ message: "Error saving data", error: error }),
      { status: 500 }
    );
  }
}
