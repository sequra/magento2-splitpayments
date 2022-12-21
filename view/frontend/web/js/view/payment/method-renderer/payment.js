/**
 * Copyright © 2017 SeQura Engineering. All rights reserved.
 */
/*browser:true*/
/*global define*/
define(
    [
        'Magento_Checkout/js/view/payment/default',
        'Sequra_Core/js/action/set-payment-method',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Checkout/js/model/quote'
    ],
    function (Component, setPaymentMethodAction, additionalValidators, quote) {
        'use strict';
        if('undefined' == typeof window.Sequra){
            window.SequraConfiguration = window.checkoutConfig.payment.sequra_splitpayments.configuration;
            window.SequraOnLoad = [];
            window.Sequra = {
                onLoad: function (callback) {
                    window.SequraOnLoad.push(callback);
                }
            };
            var a = document.createElement('script');a.async = 1;a.src = window.SequraConfiguration.scriptUri;
            var m = document.getElementsByTagName('script')[0];
            m.parentNode.insertBefore(a, m);
        }
        return Component.extend({
            defaults: {
                template: 'Sequra_Splitpayments/payment/form'
            },

            initObservable: function () {
                this._super()
                    .observe([
                        'title'
                    ]);
                this.title(window.checkoutConfig.payment.sequra_splitpayments.checkout_title);
                var comp = this;
                Sequra.onLoad(function(){
                    var creditAgreements = Sequra.computeCreditAgreements({
                        amount: comp.getAmount().toString(),
                        product: window.checkoutConfig.payment.sequra_splitpayments.product
                    });
                    var ca = creditAgreements[window.checkoutConfig.payment.sequra_splitpayments.product];
                    var instalment_total = ca[ca.length - 1]["instalment_total"]["string"];
                    var instalment_counts = ca.reverse().reduce(
                        (carry,item) => {
                            return item['instalment_count'] + "," + carry;
                        },
                        ""
                    ).replace(/,([\d]*),$/, " " + jQuery.mage.__('or') + " $1");
                    ca.reverse(); //leave it as it was
                    var interpolated_title = window.checkoutConfig.payment.sequra_splitpayments.checkout_title
                        .replace('%s', instalment_total)
                        .replace('%{instalment_counts}', instalment_counts)
                        .replace('%{instalment_total}', instalment_total);
                    comp.title(interpolated_title);
                });
                return this;
            },

            getProduct: function () {
                return window.checkoutConfig.payment.sequra_splitpayments.product;
            },

            getAmount: function () {
                var totals = quote.getTotals()();
                if (totals) {
                    return Math.round(totals['base_grand_total']*100);
                }
                return Math.round(quote['base_grand_total']*100);
            },

            showLogo: function(){
                return window.checkoutConfig.payment.sequra_splitpayments.showlogo === "1";
            },

            placeOrder: function () {
               if (additionalValidators.validate()) {
                   //update payment method information if additional data was changed
                   this.selectPaymentMethod();
                   setPaymentMethodAction(this.messageContainer);
                   return false;
               }
            },
        });
    }
);
