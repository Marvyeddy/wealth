import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { testimonialsData } from "@/data/landing";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What our users say
        </h2>
        <div>
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {testimonialsData.map((data, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="text-center space-y-2">
                        <figure className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto">
                          <Image
                            src={data.image}
                            alt="profile"
                            width={100}
                            height={100}
                            className="object-cover"
                          />
                        </figure>
                        <h2 className="font-bold text-xl capitalize">
                          {data.name}
                        </h2>
                        <h3 className="font-semibold text-base">{data.role}</h3>
                        <p className="italic">"{data.quote}"</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
