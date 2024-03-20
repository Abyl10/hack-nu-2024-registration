import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getData() {
  const res = await fetch("https://api.open.nuacm.kz/api/list/accepted", {
    next: { revalidate: 100 },
    cache: "no-cache",
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function AcceptedTeamsPage() {
  const data = await getData();

  console.log(data);

  return (
    <main className="max-w-xl w-full flex flex-col gap-4">
      <section>
        <h1 className="text-xl font-bold">Accepted teams: offline</h1>
        <h2 className="text-muted-foreground">{data.length} teams</h2>
      </section>

      <div className="md:grid md:grid-cols-2 gap-2">
        {data.map((team: any) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.team_name}</CardTitle>
              <CardDescription>
                {`${team.captian_surname} ${team.captian_name?.[0]}.`}
                {team.member2_name &&
                  `${team.member2_surname} ${team.member2_name?.[0]}.`}
                {team.member3_name &&
                  `${team.member3_surname} ${team.member3_name?.[0]}.`}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
