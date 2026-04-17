import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID!,
  region: process.env.AWS_REGION!,
  signatureVersion: 'v4',
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing file key' }, { status: 400 });
  }

  try {
    const head = await s3.headObject({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }).promise();

    // Decode original name from metadata
    const originalName = head.Metadata?.['original-name'] 
      ? decodeURIComponent(head.Metadata['original-name']) 
      : key.split('-').slice(1).join('-');

    const previewUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Expires: 600, // 10 minutes validity for preview
    });

    return NextResponse.json({
      name: originalName,
      size: head.ContentLength,
      type: head.ContentType,
      lastModified: head.LastModified,
      previewUrl
    });
  } catch (error) {
    console.error('S3 Fetch Error:', error);
    return NextResponse.json({ error: 'File not found or expired' }, { status: 404 });
  }
}
