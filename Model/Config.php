<?php
/**
 * Copyright © 2017 SeQura Engineering. All rights reserved.
 */

namespace Sequra\Splitpayments\Model;

use Sequra\Core\Model\Adminhtml\Source\Endpoint;

class Config extends \Sequra\Core\Model\Config
{
    /**
     * SeQura Splitpayments
     */
    const METHOD_CAMPAIGN = 'sequra_splitpayments';

    /**
     * @var \Magento\Framework\HTTP\Client\Curl
     */
    protected $curlClient;

    /**
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\Framework\HTTP\Client\Curl $curl
     * @param string $methodCode
     * @throws \RuntimeException
     */
    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Framework\HTTP\Client\Curl $curl,
        $methodCode = null
    ) {
        $this->curlClient = $curl;
        parent::__construct($scopeConfig, $methodCode);
    }

    public function getCostUrl($storeId = null)
    {
        $env = 'sandbox';
        if ($this->getCoreValue('endpoint', $storeId) == Endpoint::LIVE) {
            $env = 'live';
        }
        return
            'https://' . $env .
            '.sequracdn.com/scripts/' .
            $this->getMerchantRef() . '/' .
            $this->getAssetsKey() . '/' .
            $this->getProduct() . '_cost.json';
    }
}
