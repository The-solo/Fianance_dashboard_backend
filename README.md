# Setup

1. `npm install`
2. `create the .env` and add the `DATABASE_URL` and `JWT_SECRET` and `PORT`
3. `npx prisma migrate dev --name init`
4. `npm run dev`

# Roles

| Role | Can do |
|------|--------|
| viewer | read records and summary |
| analyst | same as viewer |
| admin | create, update, delete records & users |

Self-registration always creates a `viewer`.


# The admin

The admin is seeded into the primsa/seed.ts
`Admin email : admin@financeApp.com`
`Admin password : Admin#1234`

# To change the Admin credetntials 

1. `Open the prisma/seed.ts`
2. `Update the new password inside "passwordHash"`
3. `Update the admin.email in both queries`
4. `Run the following command : "npm run seed"`
NOTE : We are using the upsert so running `npm run seed` again won't create a dupilicate.

# Removing Seed Data

Before deploying to production run:
`npx prisma migrate reset`
This wipes the database and runs migrations fresh without the seed data.

If you want to keep the tables but just delete the dummy records :
`npx prisma studio`
This opens a UI where you can delete records manually.