import Mailgen from "mailgen";
import "dotenv/config";


const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: process.env.APP_NAME,
    link: process.env.FRONT_END_LINK
  }
});


export default mailGenerator;