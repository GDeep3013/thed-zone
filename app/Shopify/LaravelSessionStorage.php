<?php 
namespace App\Shopify;

use Shopify\Auth\Session;
use Shopify\Auth\SessionStorage;

class LaravelSessionStorage implements SessionStorage
{
    public function storeSession(Session $session): bool
    {
        // Store session in Laravel session
        session()->put($session->getId(), $session->toArray());
        return true;
    }

    public function loadSession(string $sessionId): ?Session
    {
        $sessionData = session()->get($sessionId);

        if ($sessionData) {
            return Session::fromArray($sessionData);
        }

        return null;
    }

    public function deleteSession(string $sessionId): bool
    {
        session()->forget($sessionId);
        return true;
    }
}
