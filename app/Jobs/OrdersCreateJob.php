<?php namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use stdClass;
use App\Models\User;
use App\Models\Order;
use Log;

class OrdersCreateJob implements ShouldQueue
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
        // Log::info('Order Create Data', ['data' => $this->data]);
        $this->shopDomain = ShopDomain::fromNative($this->shopDomain);
        $shop = User::where('name', $this->shopDomain->toNative())->first();
        // Log::info('Shop Data', ['shop' => $shop]);
        $totalQuantity = 0;
        if (isset($this->data->line_items)) {
            foreach ($this->data->line_items as $lineItem) {
                if (isset($lineItem->quantity) && isset($lineItem->name)) {
                    $totalQuantity += $lineItem->quantity;
                }
            }
        }
        $ordersDetails = Order::updateOrCreate(
            [
                'user_id' => $shop->id,
                'order_id' => $this->data->id
            ],
            [
                'order_name' => $this->data->name,
                'order_no' => $this->data->order_number,
                'email' => $this->data->email,
                'date' => \Carbon\Carbon::parse($this->data->created_at)->format('Y-m-d H:i:s'),
                'customer_id' => $this->data->customer->id,
                'customer_name' => $this->data->customer->first_name . ' ' . $this->data->customer->last_name,
                'customer_email' => $this->data->customer->email,
                'total' => $this->data->total_price,
                'payment_status' => $this->data->financial_status,
                'fullfilement' => $this->data->fulfillment_status,
                'item_count' => $totalQuantity,
                'delivery_status' => "",
                'delivery_method' => "",
                'tags' => $this->data->tags,
            ]
        );
        // Do what you wish with the data
        // Access domain name as $this->shopDomain->toNative()
    }
}
