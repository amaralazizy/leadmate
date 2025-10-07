import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function POST(req: NextRequest) {
    const body = await req.text();
    const secret = req.headers.get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, secret, webhookSecret);
    } catch(err) {
        console.error(`Webhook signature verification failed. ${getErrorMessage(err)}`)
        return NextResponse.json(
          { error: "You are not authorized" },
          { status: 401 }
        );
    }

    const data = event.data;
    const eventType = event.type;

    try {
        switch(eventType) {
            case ("checkout.session.completed"): {
                
            }
            case ("customer.subscription.deleted"): {

            }
            default:
        }
    }
    catch(err) {
        console.error(`Error in webhook: ${getErrorMessage(err)}`)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }


}