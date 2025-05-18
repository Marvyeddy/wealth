import { howItWorksData } from "@/data/landing";

const HowItWorks = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {howItWorksData.map((works, i) => {
            const Icon = works.icon;
            return (
              <div className="space-y-4 text-center" key={i}>
                <div className="size-16 bg-blue-100 flex items-center justify-center rounded-full mx-auto">
                  <Icon className="size-8 text-blue-600" />
                </div>

                <h3 className="text-xl font-semibold mb-4">{works.title}</h3>
                <p className="text-gray-600">{works.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
