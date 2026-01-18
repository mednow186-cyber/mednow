"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityModule = void 0;
const common_1 = require("@nestjs/common");
const hello_world_use_case_1 = require("./core/application/use-cases/hello-world.use-case");
const supabase_auth_adapter_1 = require("./adapters/supabase/supabase-auth.adapter");
const mongo_user_repository_adapter_1 = require("./adapters/mongo/mongo-user-repository.adapter");
let IdentityModule = class IdentityModule {
};
exports.IdentityModule = IdentityModule;
exports.IdentityModule = IdentityModule = __decorate([
    (0, common_1.Module)({
        providers: [
            hello_world_use_case_1.HelloWorldUseCase,
            {
                provide: 'AuthProviderPort',
                useClass: supabase_auth_adapter_1.SupabaseAuthAdapter,
            },
            {
                provide: 'UserRepositoryPort',
                useClass: mongo_user_repository_adapter_1.MongoUserRepositoryAdapter,
            },
        ],
        exports: [hello_world_use_case_1.HelloWorldUseCase],
    })
], IdentityModule);
//# sourceMappingURL=identity.module.js.map