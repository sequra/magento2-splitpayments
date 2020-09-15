/**
 * Copyright © 2017 SeQura Engineering. All rights reserved.
 */
define(
    [
        'jquery',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/url-builder',
        'mage/storage',
        'Magento_Checkout/js/model/error-processor',
        'Magento_Checkout/js/model/full-screen-loader',
        'Magento_Checkout/js/action/set-payment-information'
    ],
    function ($, quote, urlBuilder, storage, errorProcessor, fullScreenLoader, setPaymentInformation) {
        'use strict';
        return function (messageContainer) {
            var serviceUrl,
                placeOrder = function () {
                    fullScreenLoader.startLoader();
                    if (typeof window.SequraFormInstance === 'undefined') {
                        setTimeout(placeOrder, 100);
                        return;
                    }
                    window.SequraFormInstance.setCloseCallback(function () {
                        fullScreenLoader.stopLoader();
                        window.SequraFormInstance.defaultCloseCallback();
                    });
                    window.SequraFormInstance.setElement("sq-identification-i1");
                    window.SequraFormInstance.show();
                    fullScreenLoader.stopLoader();
                };

            return setPaymentInformation(messageContainer, quote.paymentMethod()).done(
                function () {
                    serviceUrl = urlBuilder.createUrl('/sequra_core/Submission', {});
                    storage.get(serviceUrl).done(
                        function (response) {
                            $('[id^="sq-identification"]').remove();
                            $('body').append(response);
                            placeOrder();
                        }
                    ).fail(
                        function (response) {
                            errorProcessor.process(response, messageContainer);
                            fullScreenLoader.stopLoader();
                        }
                    );
                });
        };
    }
);
