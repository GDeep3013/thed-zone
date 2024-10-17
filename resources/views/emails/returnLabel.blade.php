<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Return Request Notification</title>
</head>
<body>
    <p>Dear {{$data['customerName']}},</p>
    <p>Great news! Your return request has been approved.</p>
    <p>Please find your return label attached below. You can also download it by clicking here.</p>
    <p>If you need any assistance, feel free to email us at <a href="mailto:help@easy-clothes.com">help@easy-clothes.com</a>.</p>
    <p>A quick reminder: please do not include any non-returnable items in your return package.</p>
    <!-- @if(isset($data['labelUrl'])) -->
    <!-- Include a link to download the attached document -->
    <!-- <p>You can download the shipping label by clicking <a href="{{ $data['labelUrl'] }}" target="_blank">here</a>.</p>
    @endif -->
    
    <p>Thank you for shopping with us!</p>
    <p>Best regards,</p>
    <p>The Easy Clothes Team</p>

</body>
</html>