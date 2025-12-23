import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/server"

export default async function StaysPage() {
    const supabase = createClient();
    const { data: stays, error } = await supabase.from("stays").select("*");

    return (
      <Card>
        <CardHeader>
          <CardTitle>Stays</CardTitle>
          <CardDescription>Manage your accommodation properties.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead className="hidden md:table-cell">Total Rooms</TableHead>
                <TableHead className="hidden md:table-cell">Max Guests</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stays?.map((stay) => (
                <TableRow key={stay.id}>
                  <TableCell className="font-medium">{stay.name}</TableCell>
                  <TableCell>${stay.price_per_night}</TableCell>
                  <TableCell className="hidden md:table-cell">{stay.total_rooms}</TableCell>
                  <TableCell className="hidden md:table-cell">{stay.max_adults + stay.max_children}</TableCell>
                  <TableCell>
                    {/* Add Edit/Delete actions here */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
}
