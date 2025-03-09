import type { NextRequest } from "next/server"
import { fetchTableData, fetchTableDetails } from "@/lib/actions"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const tableId = params.id

  // Set headers for SSE
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data
      try {
        const table = await fetchTableDetails(tableId)
        const data = await fetchTableData(tableId)

        const event = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(new TextEncoder().encode(event))

        // Set up polling for updates (every 30 seconds)
        // In a production app, you might want to use webhooks or other mechanisms
        const intervalId = setInterval(async () => {
          try {
            const newData = await fetchTableData(tableId)
            const event = `data: ${JSON.stringify(newData)}\n\n`
            controller.enqueue(new TextEncoder().encode(event))
          } catch (error) {
            console.error("Error polling for updates:", error)
            clearInterval(intervalId)
            controller.close()
          }
        }, 30000) // Poll every 30 seconds

        // Clean up on client disconnect
        request.signal.addEventListener("abort", () => {
          clearInterval(intervalId)
          controller.close()
        })
      } catch (error) {
        console.error("Error setting up SSE:", error)
        controller.close()
      }
    },
  })

  return new Response(stream, { headers })
}

