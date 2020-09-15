/**
 * Copyright © 2017 SeQura Engineering. All rights reserved.
 */
/*browser:true*/
/*global define*/
define(
    [
        'Magento_Checkout/js/view/payment/default',
        'Sequra_Splitpayments/js/action/set-payment-method',
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
                this._super();
                Sequra.onLoad(function(){Sequra.refreshComponents();});
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
