import axiosInstance from "../api/axiosInstance";

const Premium = () => {
    const plans = [
        {
            name: "Silver",
            price: 199,
            period: "month",
            features: [
                "See who liked you",
                "Unlimited likes",
                "5 Super Likes per day",
                "Basic profile boost",
            ],
            buttonText: "Get Silver",
            popular: false,

        },
        {
            name: "Gold",
            price: 599,
            period: "month",
            features: [
                "Everything in Silver",
                "Unlimited Super Likes",
                "See who viewed your profile",
                "Priority in feed",
                "Profile boost (2x)",
                "Message before matching",
            ],
            buttonText: "Get Gold",
            popular: true,
        },
    ];

    async function handleBuyClick(type) {
        try {
            const order = await axiosInstance.post("/payment/create", {
                membershipType: type.toLowerCase(),
            });
            const { amount, keyId, currency, notes, orderId } = order.data
            const options = {
                key: keyId, // Replace with your Razorpay key_id
                amount: amount, // Amount is in currency subunits.
                currency,
                name: "Dev Tinder",
                description: 'connect to other Devs',
                order_id: orderId, // This is the order_id created in the backend

                prefill: {
                    name: notes?.firstName + ' ' + notes?.lastName,
                    email: notes?.emailId,
                },
                theme: {
                    color: '#F37254'
                },
            };
            //open razorpaydialog
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    }

    return (
        <div className="premium-page">
            <div className="premium-container">
                {/* Header */}
                <div className="premium-header">
                    <h1>Upgrade to Premium</h1>
                    <p>Unlock more matches and stand out from the crowd</p>
                </div>

                {/* Plans */}
                <div className="plans-grid">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`plan-card ${plan.popular ? "popular" : ""}`}
                        >
                            {plan.popular && <div className="popular-badge">MOST POPULAR</div>}

                            <div className="plan-content">
                                <h2 className="plan-name">{plan.name}</h2>

                                <div className="plan-price">
                                    <span className="price">₹{plan.price}</span>
                                    <span className="period">/{plan.period}</span>
                                </div>

                                <ul className="features-list">
                                    {plan.features.map((feature, index) => (
                                        <li key={index}>
                                            <span className="checkmark">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className="plan-btn" onClick={() => handleBuyClick(plan?.name)}>{plan.buttonText}</button>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="premium-footer">
                    Cancel anytime. Secure payment powered by Razorpay.
                </p>
            </div>
        </div>
    );
};

export default Premium;