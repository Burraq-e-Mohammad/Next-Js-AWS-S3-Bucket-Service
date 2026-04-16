import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID!,
  region: process.env.AWS_REGION!,
  signatureVersion: 'v4',
})

export async function POST(req: NextRequest) {
  const { key } = await req.json();

  if (!key) {
    return NextResponse.json({ error: 'Missing file key' }, { status: 400 });
  }

  try {
    // Generate a very short-lived signed URL (60 seconds)
    // specifically for the download button click.
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Expires: 60, 
      ResponseContentDisposition: 'attachment' // Forces download
    });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('S3 Sign Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
