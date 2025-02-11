/* eslint-disable @typescript-eslint/ban-ts-comment */
export const autoScroll = async (page: any) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        //@ts-expect-error
        const scrollHeight = document.body.scrollHeight;

        //@ts-expect-error
        window.scrollBy(0, distance);
        totalHeight += distance;

        //@ts-expect-error
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
};
