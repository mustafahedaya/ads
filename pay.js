document.addEventListener('DOMContentLoaded', () => {
    // Extract userId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const displayId = document.getElementById('display-user-id');

    if (userId) {
        if (displayId) displayId.textContent = "Target ID: " + userId;

        // Check if PayPal SDK loaded
        if (typeof paypal !== 'undefined') {
            paypal.Buttons({
                style: {
                    shape: 'pill',
                    color: 'blue',
                    layout: 'vertical',
                    label: 'subscribe'
                },
                createSubscription: function (data, actions) {
                    return actions.subscription.create({
                        plan_id: 'P-3VB288152L6027506NFGODOY',
                        custom_id: userId,
                        application_context: {
                            shipping_preference: 'NO_SHIPPING'
                        }
                    });
                },
                onApprove: function (data, actions) {
                    alert("Subscription successful! ID: " + data.subscriptionID + "\nYour Pro status will be active in a few seconds.");
                    window.close();
                }
            }).render('#paypal-button-container-P-3VB288152L6027506NFGODOY');
        } else {
            console.error("PayPal SDK not loaded.");
            // If we are on chrome-extension://, this is expected due to CSP
            if (window.location.protocol === 'chrome-extension:') {
                const errorMsg = document.createElement('p');
                errorMsg.style.color = '#ff5252';
                errorMsg.style.marginTop = '20px';
                errorMsg.textContent = "⚠️ PayPal buttons cannot load locally. Please host this page on GitHub Pages.";
                document.querySelector('.container').appendChild(errorMsg);
            }
        }

    } else {
        if (displayId) {
            displayId.textContent = "Error: No User ID found. Please open from the extension.";
            displayId.style.color = "#ff5252";
        }
    }
});
