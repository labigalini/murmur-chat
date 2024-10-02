# Murmur Chat

Murmur is a private chat app where conversations are short-lived and secure.

# Features

Features provided out of the box:

- Realtime database
- User sign-in and sign-up
- ... ?

# Stack

- 🧩 **Convex**: Reactive typesafe backend with auth, database and file storage.
- 🛍️ **Stripe**: Subscription Plans, Customer Portal, and more.
- 🎨 **TailwindCSS**: Utility-First CSS Framework.
- 📐 **ShadCN**: Composable React components.
- 🌙 **Easy Theming**: Switch between Light and Dark modes with ease.
- 📧 **Resend**: Email for Developers.
- 💌 **React Email**: Customizable Emails with React.
- 📋 **Conform**: Type-Safe Form Validation based on Web Fundamentals.
- 🌐 **I18N**: Internationalization for your App.
- 🔺 **Next.js**:

# Getting Started

```sh
# create new project - TODO this doesn't work yet
npm create convex@latest -- -t labigalini/saas-starter

# install dependencies
npm install

# set up a new Convex project
npx convex dev --configure=new --once

# initialize the database
npx convex run migration:init

# run project
npm run dev
```

# Environment

## Email

[Resend](https://resend.com/) is a simple and easy-to-use email service for developers.

1. Get your API Key by visiting the [Resend Dashboard](https://resend.com/api-keys).
2. Add to your Convex dev deployment:
   ```sh
   npx convex env set RESEND_API_KEY re_...
   ```

## Stripe

In order to use Stripe Subscriptions and seed our database, we'll require to get the secret keys from our Stripe Dashboard.

1. Create a [Stripe Account](https://dashboard.stripe.com/login) or use an existing one.
2. Set to test mode if desired.
3. Visit the [API Keys](https://dashboard.stripe.com/test/apikeys) section and copy `Secret` key.
4. Add to your Convex dev deployment:
   ```sh
   npx convex env set STRIPE_SECRET_KEY sk_test_...
   ```

## Stripe Webhook

Stripe sends webhook events when your users update or delete their subscriptions.

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run the local webhook server:

```sh
stripe listen --forward-to localhost:5173/api/webhook
```

4. After running the first time, you may be prompted to authenticate. If so, after
   authenticating, rerun the command.
5. The CLI will print a webhook secret key and begin listening for events.
6. Add the webhook secret key to your Convex dev deployment:
   ```sh
   npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
   ```

> [!IMPORTANT]
> This command should be running in your console during local development if testing or handling Stripe Events.

# Deployment

Instruction to deploy to production.

## Stripe Webhook

To get started, we'll require to get our Stripe Production Webhook API Key. This key will be required to set up the `STRIPE_WEBHOOK_ENDPOINT` variable in our `.env` file.

1. Visit the [Stripe Webhook](https://dashboard.stripe.com/test/webhooks) section.
2. Create a new Webhook Endpoint.
3. Set the name of your future deployed app as the Webhook URL input. _(Check Notes)_
4. Select the latest Stripe API version from `API version` selector.
5. Select the following events to listen on: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
6. Add the Endpoint and reveal the `Signing Secret` value that has been provided from Stripe Webhook page.
7. Set this new secret as `STRIPE_WEBHOOK_SECRET` variable into your `.env` file.

Done! Now we can start receiving Stripe Events to your deployed app.

## Vercel

Follow the Convex guide for Vercel deployment: https://docs.convex.dev/production/hosting/vercel

# Done! 🎉

That's it! You've successfully deployed your SaaS application.
