import helmet from "helmet";

const SecurityHeaders = helmet({
   contentSecurityPolicy: {
      useDefaults: true,
      directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000", "http://localhost:5173", "https://fluxelio.vercel.app/", "https://fluxelio.vercel.app"],
         connectSrc: ["'self'", "http://localhost:3000", "http://localhost:3000", "http://localhost:5173", "https://fluxelio.vercel.app/", "https://fluxelio.vercel.app"],
         fontSrc: ["'self'", "https:", "data:"],
         objectSrc: ["'none'"],
      },
   },
   crossOriginEmbedderPolicy: false,
   crossOriginResourcePolicy: { policy: "cross-origin" },
});

export default SecurityHeaders;
