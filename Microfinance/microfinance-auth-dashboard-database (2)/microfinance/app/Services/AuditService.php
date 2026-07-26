<?php

namespace App\Services;

use App\Models\AuditLogModel;
use CodeIgniter\HTTP\IncomingRequest;

/**
 * Every module writes audit entries through this single service so the
 * log format and capture logic (IP, user agent) stays consistent
 * everywhere instead of being re-implemented per controller.
 */
class AuditService
{
    private AuditLogModel $logs;

    public function __construct(?AuditLogModel $logs = null)
    {
        $this->logs = $logs ?? new AuditLogModel();
    }

    public function log(
        ?int $userId,
        string $action,
        string $module,
        ?string $description = null,
        array $meta = []
    ): void {
        /** @var IncomingRequest $request */
        $request = service('request');

        $this->logs->insert([
            'user_id'     => $userId,
            'action'      => $action,
            'module'      => $module,
            'description' => $description,
            'ip_address'  => $request->getIPAddress(),
            'user_agent'  => (string) $request->getUserAgent(),
            'meta'        => $meta === [] ? null : json_encode($meta),
        ]);
    }
}
