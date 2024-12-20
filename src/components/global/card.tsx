import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const TwitterCard = () => {
  return (
    <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Twitter post</CardTitle>
      <CardDescription>Post description</CardDescription>
    </CardHeader>
    <CardContent>
     <div>
        post image
     </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button size={"sm"} variant="outline">Statue</Button>
      <Button size={"sm"}>schedule post</Button>
    </CardFooter>
  </Card>
  )
}

export default TwitterCard