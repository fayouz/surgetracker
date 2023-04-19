<?php

namespace App\EventListener;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Security\Core\User\UserInterface;


class AuthenticationSuccessListener
{

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {

        $user = $event->getUser();
        if (!$user instanceof UserInterface) {
            return;
        }

        $data = [
            'roles' => $user->getRoles(),
            'username' => $user->getUserIdentifier(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
        ];


        $event->setData($data);

    }
}
