import { featuresData } from "@/data/landing";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Feature = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to manage your finances
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i}>
                <CardContent className="space-y-4 pt-4">
                  <Icon className="size-8 text-blue-600" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <h3 className="text-gray-600">{feature.description}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Feature;
