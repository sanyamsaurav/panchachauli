import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";

// POST /api/newsletter - Subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { email } = body;

    // Validation
    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await NewsletterSubscriber.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { success: false, message: "This email is already subscribed" },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        return NextResponse.json(
          { success: true, message: "Welcome back! Your subscription has been reactivated" },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase().trim(),
      source: "website",
    });

    await subscriber.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for subscribing! Check your email for confirmation." 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
