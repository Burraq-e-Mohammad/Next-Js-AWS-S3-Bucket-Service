import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID!,
  region: process.env.AWS_REGION!,
  signatureVersion: 'v4', 
})

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const MAX_SIZE = 10 * 1024 * 1024; 

  if (buffer.length > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 413 });
  }

  const key = `uploads/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    Metadata: {
      'original-name': encodeURIComponent(file.name)
    }
  };

  try {
    await s3.upload(uploadParams).promise();
    
    const origin = req.nextUrl.origin;
    const shareableLink = `${origin}/download/${key}`;

    return NextResponse.json({ 
      url: shareableLink,
      message: 'Shareable landing page link generated. Link expires in 10 minutes.' 
    });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return NextResponse.json({ error: 'Upload Failed' }, { status: 500 });
  }
}
