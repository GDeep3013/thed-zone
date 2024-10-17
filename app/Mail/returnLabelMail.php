<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class returnLabelMail extends Mailable
{
    use Queueable, SerializesModels;

    public $mailData;

    public function __construct($mailData)
    {

        $this->mailData = $mailData;
    }

    public function envelope()
    {
        return new Envelope(
            subject: $this->mailData['subject'],
        );
    }

    public function build()
    {
        $email = $this->view('emails.returnLabel')
        ->with([
            'data' => $this->mailData,
        ]);
        
        if (isset($this->mailData['labelUrl'])) {
            $documentUrl = $this->mailData['labelUrl'];
            $documentName = 'shipping_label.png';
            $documentContents = file_get_contents($documentUrl);

            $email->attachData($documentContents, $documentName, [
                'mime' => 'image/png',
            ]);
        }

        return $email;
    }
    // public function attachments()
    // {
    //     return [];
    // }
}
