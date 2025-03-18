document.addEventListener("DOMContentLoaded", async function () {
    console.log("✅ Page Loaded, Checking Cashfree SDK...");

    await new Promise(resolve => {
        let checkSDK = setInterval(() => {
            if (window.Cashfree && window.Cashfree.PG) {
                clearInterval(checkSDK);
                console.log("✅ Cashfree SDK Loaded Successfully");
                resolve();
            }
        }, 500);

        setTimeout(() => {
            clearInterval(checkSDK);
            console.error("❌ Cashfree SDK failed to load after 10 seconds!");
            alert("Cashfree SDK failed to load! Check console for errors.");
        }, 10000);
    });

    setupPayment();
});

function setupPayment() {
    let payButton = document.getElementById("payBtn");

    if (!payButton) {
        console.error("❌ Pay Button not found!");
        alert("Pay button is missing on the page!");
        return;
    }

    payButton.addEventListener("click", async function () {
        console.log("🛒 Pay button clicked! Initiating payment...");

        try {
            let orderData = await createOrder();

            if (!orderData || !orderData.payment_session_id) {
                console.error("⚠️ Invalid order response! No session ID found.");
                alert("Payment session ID missing. Check console logs.");
                return;
            }

            console.log("✅ Order Created, Session ID:", orderData.payment_session_id);

            // Start Cashfree Payment Session
            Cashfree.PG({
                checkout: {
                    paymentSessionId: orderData.payment_session_id
                }
            });

        } catch (error) {
            console.error("❌ Error in payment:", error);
            alert("Payment failed! Check the console.");
        }
    });
}

async function createOrder() {
    console.log("🔄 Sending payment request...");

    try {
        let response = await fetch("http://localhost:8081/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                {
                    order_amount: 500,
                    order_currency: "INR",
                    customer_details: {
                      customer_id: "12345",
                      customer_name: "User",
                      customer_email: "test@example.com",
                      customer_phone: "9999999999"
                    }
                  }
            )
        });

        let data = await response.json();
        console.log("✅ Full API Response from Backend:", data);

        if (!response.ok) {
            console.error(`❌ Server Error! Status: ${response.status}, Message:`, data);
            alert(`Server error: ${response.status}. Check console logs.`);
            return null;
        }

        if (!data.payment_session_id) {
            console.error("⚠️ Missing payment_session_id! Full response:", data);
            alert("Invalid response from server. No session ID found.");
            return null;
        }

        return data;

    } catch (error) {
        console.error("❌ API Request Failed:", error);
        alert("Error connecting to payment server! Check console.");
        return null;
    }
}
