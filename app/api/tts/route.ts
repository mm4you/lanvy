import { NextResponse } from 'next/server';
import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs';
import path from 'path';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    // Security: Rate limiting
    const ip = (request.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim();
    const limiter = rateLimit(ip, 30, 60000); // 30 requests per minute

    if (!limiter.success) {
      return new NextResponse('Too Many Requests. Vui lòng thử lại sau một phút.', { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const langParam = searchParams.get('lang') || 'zh';

    if (!text) {
      return new NextResponse('Missing text parameter', { status: 400 });
    }

    if (text.length > 200) {
      return new NextResponse('Text parameter exceeds maximum length of 200 characters', { status: 400 });
    }

    // Map requested language to high-quality Edge TTS voices
    let voice = 'zh-CN-XiaoxiaoNeural'; // Default: Chinese Female (Xiaoxiao)
    let lang = 'zh-CN';
    let fallbackLang = 'zh';

    const lowerLang = langParam.toLowerCase();
    if (lowerLang === 'en') {
      voice = 'en-US-AvaNeural';
      lang = 'en-US';
      fallbackLang = 'en';
    } else if (lowerLang === 'vi') {
      voice = 'vi-VN-HoaiMyNeural';
      lang = 'vi-VN';
      fallbackLang = 'vi';
    } else if (lowerLang === 'zh-tw' || lowerLang === 'zhtw') {
      voice = 'zh-TW-HsiaoChenNeural';
      lang = 'zh-TW';
      fallbackLang = 'zh-TW';
    }

    const tts = new EdgeTTS({
      voice,
      lang
    });

    // Create temporary file path in /tmp
    const tmpFilePath = path.join('/tmp', `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`);
    
    // Set a timeout of 2.5 seconds for EdgeTTS
    const ttsPromise = tts.ttsPromise(text, tmpFilePath);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('EdgeTTS Timeout')), 2500)
    );

    await Promise.race([ttsPromise, timeoutPromise]);

    const buffer = fs.readFileSync(tmpFilePath);

    // Clean up temporary file
    try {
      fs.unlinkSync(tmpFilePath);
    } catch (e) {
      console.error('Failed to cleanup tmp file:', e);
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('TTS Proxy Error:', error);
    // Fallback to Google TTS
    try {
      const text = new URL(request.url).searchParams.get('text') || '';
      const langParam = new URL(request.url).searchParams.get('lang') || 'zh';
      const isEn = langParam.toLowerCase() === 'en';
      const isVi = langParam.toLowerCase() === 'vi';
      const fallbackLang = isEn ? 'en' : (isVi ? 'vi' : 'zh');
      
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${fallbackLang}&client=tw-ob&q=${encodeURIComponent(text)}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://translate.google.com/'
        }
      });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return new NextResponse(arrayBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      }
    } catch (e) {
      console.error('Google TTS Fallback Error:', e);
    }

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
