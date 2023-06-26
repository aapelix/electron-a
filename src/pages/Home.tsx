function Home() {
  const news = [
    {
      title: "Test",
      id: 1,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Test 2",
      id: 2,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Test 3",
      id: 3,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  return (
    <div>
      <div className="pt-20 bg-[url(/smp.png)] pb-40 bg-cover flex justify-center items-center">
        <h1 className="text-white text-center text-6xl font-bold">Home</h1>
      </div>
      <div className="flex">
        {news.map((item) => (
          <div
            className="text-white w-96 bg-primary h-44 m-4 rounded-lg hover:scale-110 duration-300 cursor-pointer hover:rounded-md"
            key={item.id}
          >
            <div className="m-4">
              <h1 className="font-bold text-xl">{item.title}</h1>
              <p className="text-[#aeb0b8]">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
