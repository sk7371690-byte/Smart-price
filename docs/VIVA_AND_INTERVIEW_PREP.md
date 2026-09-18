# SmartPrice — Viva Voce Defense & Technical Interview Preparation (25 Questions & Answers)

---

## Section 1: Architecture, Design Patterns & Concurrency

### Q1: Why did you choose the MERN stack for SmartPrice?
**Answer:**
The MERN stack (MongoDB, Express.js, React 18, Node.js) offers single-language JavaScript/Node.js full-stack development, minimizing context switching. Node.js's event-driven, non-blocking I/O model is uniquely suited for I/O-heavy workloads like dispatching parallel network scrapes across multiple retailer endpoints. React 18 provides component-driven UI reusability and concurrent rendering, while MongoDB's flexible document schema effortlessly accommodates varied, polymorphic product specifications across different e-commerce retailers.

### Q2: How does the Retailer Provider Adapter Pattern work in your codebase?
**Answer:**
We implemented the **Adapter Pattern** combined with the **Factory Pattern**. An abstract base class `BaseProvider.js` defines an interface contract (`searchProducts()`, `getProductDetails()`, `parseHtml()`). Concrete implementations—`MockAmazonProvider`, `MockFlipkartProvider`, `MockMyntraProvider`, and `MockCromaProvider`—adapt retailer-specific API structures or DOM markup into standardized internal models. The `RetailerFactory.js` orchestrates parallel execution across all adapters. This satisfies the Open/Closed Principle: adding a new retailer (e.g. Reliance Digital) requires creating a single new provider class without touching existing controllers.

### Q3: Why did you use `Promise.allSettled` instead of `Promise.all` when querying retailers?
**Answer:**
`Promise.all` employs fail-fast behavior: if any single promise rejects (e.g., Flipkart times out or responds with an HTTP 503), the entire composite promise rejects immediately, causing the user's search to fail completely. In contrast, `Promise.allSettled` waits for all retailer promises to either resolve or reject. We inspect the array of results and filter for fulfilled responses (`status === 'fulfilled'`). This ensures resilience: if 1 retailer is offline, the remaining 3 stores display results seamlessly.

---

## Section 2: Algorithmic Core, Matching & Formulas

### Q4: What is the "Effective Price Formula" and why is nominal price comparison flawed?
**Answer:**
Nominal listing price is deceptive in e-commerce because retailers use hidden delivery fees or instant coupons to manipulate rank. Our platform enforces:
$$\text{Effective Price} = \text{Price} + \text{Delivery Charge} - \text{Known Discounts}$$
For example, if Store A lists an item at ₹1,000 + ₹100 delivery = ₹1,100, and Store B lists at ₹1,050 with free delivery and a ₹50 bank coupon = ₹1,000, Store B is the true best deal. SmartPrice calculates the true net expenditure at checkout.

### Q5: How do you prevent false-positive matches in product entity resolution?
**Answer:**
We built a **Tier 3 Variant Conflict Gatekeeper** inside `ProductMatchingEngine.js`. Before checking title similarity, we extract critical hardware and sizing attributes using regex:
- Storage capacities (64GB, 128GB, 256GB, 512GB, 1TB)
- RAM / Unified Memory (8GB, 16GB, 32GB)
- Footwear sizes (UK 7, UK 8, UK 9, UK 10)
If two products match on brand and model but possess conflicting variant attributes (e.g., iPhone 15 128GB vs iPhone 15 256GB), the engine immediately rejects the match with `matchTier: 'REJECTED_VARIANT_CONFLICT'`, regardless of fuzzy title similarity.

### Q6: How does your Fuzzy Matching algorithm work when barcodes are unavailable?
**Answer:**
When barcodes (GTIN/EAN/UPC) are absent, we run a multi-step pipeline:
1. **Title Normalization**: Lowercase conversion, removal of noise characters and marketing keywords ("5G", "Latest Model", "HOT DEAL", "Smartphone").
2. **Tokenization & Stop-word Filtering**: Splits string into meaningful alphanumeric tokens.
3. **Similarity Metric**: We compute Levenshtein distance normalized by string length combined with Jaccard token overlap. If the composite score is $\ge 0.78$ and no variant conflict exists, the products are merged as identical canonical items.

### Q7: How is the AI Deal Score (0 to 100) calculated?
**Answer:**
The Deal Score is a weighted multi-factor composite:
$$\text{Deal Score} = 0.40 \cdot S_{\text{hist}} + 0.30 \cdot S_{\text{spread}} + 0.20 \cdot S_{\text{rating}} + 0.10 \cdot S_{\text{fulfillment}}$$
- **Historical Price (40%)**: Compares current price against the 90-day average and all-time low. If matching all-time low, score is 100.
- **Retailer Spread (30%)**: Measures savings percentage compared to the runner-up store.
- **Customer Rating (20%)**: Normalized 5-star review score.
- **Fulfillment (10%)**: Delivery cost impact (0 delivery = 100).
A score $\ge 80$ yields a "STRONG BUY", while $< 45$ triggers a "WAIT FOR SALE" warning.

---

## Section 3: Database Design, Normalization & Performance

### Q8: Explain your database schema design. Is it normalized or denormalized?
**Answer:**
We utilized a hybrid document schema in MongoDB:
- **Normalized Relationships**: Core entities like `User`, `Product`, `Retailer`, `Wishlist`, and `PriceAlert` are separate collections referenced via ObjectIds to prevent data duplication and maintain referential integrity.
- **Strategic Denormalization (Caching)**: The `Product` schema embeds a `lowestOffer` sub-document containing the current winning price, retailer name, and timestamp. This allows instant rendering of search result grids without requiring expensive MongoDB `$lookup` table joins on every search query.

### Q9: What indexes did you implement in MongoDB and why?
**Answer:**
1. Compound text index on `Product` (`{ title: 'text', description: 'text', brand: 'text' }`) for high-speed full-text search.
2. Compound indexes on `{ category: 1, 'lowestOffer.effectivePrice': 1 }` to accelerate filtered queries when users filter by category and sort by price ascending.
3. Compound unique index on `Wishlist` (`{ user: 1 }`) and `PriceAlert` (`{ user: 1, product: 1 }`) to enforce idempotency and prevent duplicate records.
4. Timestamp index on `PriceHistory` (`{ product: 1, timestamp: -1 }`) to query 7D/30D/90D historical price slices in milliseconds.

---

## Section 4: Security Hardening & Vulnerability Mitigation

### Q10: How do you prevent NoSQL Injection attacks in MongoDB?
**Answer:**
In MongoDB, NoSQL injection occurs when unvalidated user input containing query operator objects (e.g., `{ "password": { "$gt": "" } }`) is passed directly into Mongoose queries, causing the condition to evaluate to true. We implemented `mongoSanitize` middleware in `server/middleware/securityMiddleware.js` that recursively walks `req.body`, `req.query`, and `req.params` and strips any keys that begin with `$` or contain dots (`.`).

### Q11: How do you mitigate Cross-Site Scripting (XSS)?
**Answer:**
We employ defense-in-depth:
1. `xssClean` middleware on the server sanitizes incoming text by stripping `<script>` tags, inline event handlers (`onload`, `onerror`), and dangerous HTML tags.
2. React on the frontend automatically escapes values rendered within JSX expressions `{variable}`, treating them as strings rather than executable HTML.
3. Helmet sets a strict `Content-Security-Policy` header restricting script execution sources.

### Q12: Explain your Rate Limiting strategy.
**Answer:**
Using `express-rate-limit`, we established a multi-tiered rate limiting strategy:
1. **Global API Limiter**: 300 requests per 15 minutes per IP to absorb general browsing.
2. **Auth Limiter**: Strict limit of 20 attempts per 15 minutes on `/api/auth/login` and `/api/auth/register` to prevent dictionary attacks and credential stuffing.
3. **AI Limiter**: 60 requests per minute on `/api/ai` to prevent computational exhaustion from NLP parsing and deal scoring.
When exceeded, the server returns HTTP 429 Too Many Requests with a `Retry-After` header.

### Q13: How does JWT authentication work and how do you protect admin routes?
**Answer:**
Upon successful password verification via Bcrypt, the server signs a stateless JSON Web Token (JWT) containing the user's `_id` using a server-side `JWT_SECRET`. The client transmits this token in the `Authorization: Bearer <token>` header. Our `protect` middleware decodes the token and attaches `req.user`. The `authorize('admin')` middleware then checks whether `req.user.role === 'admin'`. If not, it returns HTTP 403 Forbidden.

---

## Section 5: DevOps, Containerization & Production

### Q14: How does your Docker Compose configuration work?
**Answer:**
Our root `docker-compose.yml` orchestrates 3 isolated services:
1. `mongodb`: Runs `mongo:7.0` image with a persistent named volume `mongo_data` mounted to `/data/db`.
2. `server`: Built from `server/Dockerfile` using Node 20 alpine, running on port 5000, depending on `mongodb`.
3. `client`: Multi-stage build (Node 20 builder $\rightarrow$ Nginx Alpine) serving static assets on port 5173 with automated `/api/` reverse-proxy forwarding to the server.
All 3 containers communicate via a custom bridge network `smartprice-network`.

### Q15: Why did you use a multi-stage Dockerfile for the frontend?
**Answer:**
A naive single-stage Dockerfile includes Node.js runtime, npm dependencies, source code, and build tools, resulting in image sizes exceeding 800MB. A multi-stage build uses Node 20 only during Stage 1 to compile Vite assets into `dist/`, then copies only the static HTML/CSS/JS artifacts into a lightweight `nginx:alpine` image in Stage 2. This reduces the production image to under **25MB**, minimizes the attack surface, and leverages Nginx's C-based static file serving.

### Q16: How do you handle SPA routing on Vercel and Nginx when users refresh a page?
**Answer:**
In Single-Page Applications using React Router, browser navigation to `/product/123` or `/admin` causes the browser to request that exact path from the server. Without special handling, the web server looks for a physical folder and returns a 404. In `client/vercel.json`, we defined a rewrite rule `{"source": "/(.*)", "destination": "/index.html"}`. In `client/nginx.conf`, we configured `try_files $uri $uri/ /index.html;`. This instructs the server to serve `index.html` for all unknown paths, allowing React Router to handle client-side rendering.

---

## Section 6: Viva Rapid-Fire Q&A

**Q17: What HTTP status code is returned when a user requests an admin route without logging in?**  
**A:** `401 Unauthorized`.

**Q18: What status code is returned when a logged-in standard user attempts to access an admin route?**  
**A:** `403 Forbidden`.

**Q19: What is the purpose of Helmet in Express?**  
**A:** Helmet sets 15+ secure HTTP response headers (CSP, X-Frame-Options, X-Content-Type-Options, HSTS) to protect against clickjacking, MIME-sniffing, and XSS.

**Q20: Why do we use Bcrypt with a salt factor of 10 instead of SHA-256 for passwords?**  
**A:** SHA-256 is a fast cryptographic hash vulnerable to GPU-accelerated rainbow table cracking. Bcrypt is an intentionally slow, adaptive key-derivation function that incorporates random salt and configurable work rounds to resist brute-force attacks.

**Q21: How does your app handle MongoDB disconnections?**  
**A:** Controllers check `mongoose.connection.readyState === 1`. If disconnected, they immediately serve in-memory fallback catalogs in under 4ms rather than hanging on Mongoose's default 10-second timeout.

**Q22: How does your NLP query parser convert "under 70k" into a number?**  
**A:** A regular expression matches the numeric scalar and multiplier unit `k` or `lakh`. When `k` is matched, it multiplies the float by 1,000 to return the integer `70000`.

**Q23: How do you prevent memory leaks when polling or setting timers in React?**  
**A:** In `useEffect`, we return a cleanup function (`return () => clearInterval(timer)`) and use an `isMounted` boolean flag to discard asynchronous state updates if the component unmounts.

**Q24: What is the time complexity of the Levenshtein distance algorithm?**  
**A:** $O(m \times n)$, where $m$ and $n$ are the lengths of the two strings being compared. In our implementation, strings are pre-normalized and capped, keeping execution time negligible.

**Q25: What metrics did your automated test suite verify?**  
**A:** 16 tests across 5 suites: NoSQL sanitization, XSS sanitization, Effective Price formula, lowest offer ranking, variant gatekeeper conflict rejection, NLP parsing, Deal Score calculations, Helmet CSP headers, and RBAC 401/403/200 enforcement. All 16 passed with 0 failures.
