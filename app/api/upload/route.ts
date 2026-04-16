import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID!,
  region: process.env.AWS_REGION!,
})

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${Date.now()}-${file.name}`,
    Body: buffer,
    ContentType: file.type
  };
  try {
    const result = await s3.upload(params).promise();
    return NextResponse.json({ url: result.Location });
  } catch (error) {
    return NextResponse.json({ error: 'Upload Failed'}, {status: 500})
  }
}
