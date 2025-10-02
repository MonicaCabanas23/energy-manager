import { NextRequest, NextResponse } from "next/server";

interface DeleteParams {
    id: number;
}

export async function DELETE(
    req: NextRequest,
    params: DeleteParams
) {
    try {
        const id = params.id
        console.log(id)
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error deleting sensor'}, {status: 500})
    }
}