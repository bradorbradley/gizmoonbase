import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    version: "vNext",
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    name: "Gizmo Wrapper (Test)",
    shortDescription: "Loads a Gizmo share URL inside Base App.",
    longDescription: "Wrapper that iframes a Gizmo and nothing else.",
    icon: "https://your-domain.com/icon.png",
    websiteUrl: "https://your-domain.com"
  }

  return NextResponse.json(manifest)
}