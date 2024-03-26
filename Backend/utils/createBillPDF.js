import puppeteer from "puppeteer";

const createBillPDF = async (orderData) => {
    try {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short', hour12: false };
        const formattedOrderDate = new Date().toLocaleDateString('vi-VN', options);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const htmlContent = `
            <html>
            <head>
                <style>
                    /* Add your CSS styles here */
                    body {
                        font-family: Arial, sans-serif;
                    }
                    /* Position the logo in the top right corner */
                    .logo-container {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                    }
                    /* Add any other styles you need */
                </style>
            </head>
            <body>
                <div class="logo-container">
                    <img src="https://res.cloudinary.com/ds3gsxqhm/image/upload/v1710752517/tour-images/TOURVIET_cdonme.png" alt="Your Logo" width="100" height="auto">
                </div>
                <h1>Bill Information</h1>
                <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                <p><strong>Order Date:</strong> ${formattedOrderDate}</p>
                <p><strong>Full Name:</strong> ${orderData.fullName}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Phone:</strong> ${orderData.phone}</p>
                <p><strong>Address:</strong> ${orderData.address}</p>
                <ul>
                    ${orderData.products.map(product => `<li>${product.name} - ${product.price} VND x ${product.quantity}</li>`).join("")}
                </ul>
                <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
                <p><strong>Payment Status:</strong> ${orderData.paymentStatus}</p>
                <p><strong>Total Amount:</strong> ${orderData.totalAmount} VND</p>
            </body>
            </html>
        `;

        await page.setContent(htmlContent);
        await page.pdf({ path: "bill.pdf", format: "A4" });

        await browser.close();

        return "bill.pdf";
    } catch (error) {
        throw new Error(error.message);
    }
};

export default createBillPDF;
