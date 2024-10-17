<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use stdClass;
use App\Models\User;
use App\Models\TimeLine;
use App\Models\OrderRequest;
use Log;

class OrdersUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Shop's myshopify domain
     *
     * @var ShopDomain|string
     */
    public $shopDomain;

    /**
     * The webhook data
     *
     * @var object
     */
    public $data;

    /**
     * Create a new job instance.
     *
     * @param string   $shopDomain The shop's myshopify domain.
     * @param stdClass $data       The webhook data (JSON decoded).
     *
     * @return void
     */
    public function __construct($shopDomain, $data)
    {
        $this->shopDomain = $shopDomain;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Convert domain
        $this->shopDomain = ShopDomain::fromNative($this->shopDomain);
        $shop = User::where('name', $this->shopDomain->toNative())->first();

        $order =  $this->data; // fulfillment_status
        $orderData = OrderRequest::where('order_id', $order->id)->first();
        if ($orderData) {
            $status = null;
            $resolution = json_decode($orderData->resolution, true);
            foreach ($order->line_items as $lineItem) {
                if ($resolution['replaceItems'][$lineItem->product_id] === $lineItem->variant_id) {
                    if (count($order->refunds) > 0) {
                        $status = "Exchange and Refunded";
                    } else {
                        $status = "Exchange";
                    }
                }
            }
            $orderData->refund_status = $status;
            if($orderData->save()) {
                $message = ($status != null && $status === "Exchange") ? "replaced" : "replaecd and refunded";
                $timeLine = new TimeLine();
                $timeLine->user_id = $shop->id;
                $timeLine->order_id = $orderData->order_id;
                $timeLine->message = "Custom return order successfully ".$message;
                $timeLine->save();
            }
        }
        // if($order){

        //     Orders::where('order_id',$order->id)->update([
        //         'date' => \Carbon\Carbon::parse($order->updated_at)->format('Y-m-d H:i:s'),
        //         'fullfilement' => $order->fulfillment_status
        //     ]);

        // }
    }
}
