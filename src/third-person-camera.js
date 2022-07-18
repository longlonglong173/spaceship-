import { THREE } from './three-defs.js';

import { entity } from './entity.js';

export const third_person_camera = (() => {
    class ThirdPersonCamera extends entity.Component {
        constructor(params) {
            super();
            this.pos_x = 0;
            this.pos_y = 10;
            this.pos_z = 20;
            this.params_ = params;
            this.camera_ = params.camera;

            this.currentPosition_ = new THREE.Vector3();
            this.SetPass(1);
            document.addEventListener(
                'keydown',
                (e) => this.OnKeyDown_(e),
                false
            );
        }

        // SetNewPos({ x = 0, y = 10, z = 20 }) {
        //     this.pos_x = x;
        //     this.pos_y = y;
        //     this.pos_z = z;
        // }

        OnKeyDown_(event) {
            if (event.currentTarget.activeElement != document.body) {
                return;
            }
            switch (event.keyCode) {
                case 85: // u => x tang
                    if (this.pos_x > 360) this.pos_x = 0;
                    else this.pos_x += 2;
                    break;
                case 74: // j => x giam
                    this.pos_x -= 2;
                    break;
                case 73: // i => y tang
                    this.pos_y += 2;
                    break;
                case 75: // k => y giam
                    this.pos_y -= 2;
                    break;
                case 79: // o => z tang
                    this.pos_z += 2;
                    break;
                case 76: // l => z giam
                    this.pos_z -= 2;
                    break;
                case 80: // return default
                    this.pos_x = 0;
                    this.pos_y = 10;
                    this.pos_z = 20;
                    break;
            }
        }

        _CalculateIdealOffset() {
            const idealOffset = new THREE.Vector3(
                this.pos_x,
                this.pos_y,
                this.pos_z
            );
            const input = this.Parent.Attributes.InputCurrent;

            if (input.axis1Side) {
                idealOffset.lerp(
                    new THREE.Vector3(10 * input.axis1Side, 5, 20),
                    Math.abs(input.axis1Side)
                );
            }

            if (input.axis1Forward < 0) {
                idealOffset.lerp(
                    new THREE.Vector3(0, 0, 18 * -input.axis1Forward),
                    Math.abs(input.axis1Forward)
                );
            }

            if (input.axis1Forward > 0) {
                idealOffset.lerp(
                    new THREE.Vector3(0, 5, 15 * input.axis1Forward),
                    Math.abs(input.axis1Forward)
                );
            }

            idealOffset.applyQuaternion(this.params_.target.Quaternion);
            idealOffset.add(this.params_.target.Position);

            return idealOffset;
        }

        Update(timeElapsed) {
            const idealOffset = this._CalculateIdealOffset();

            const t1 = 1.0 - Math.pow(0.05, timeElapsed);
            const t2 = 1.0 - Math.pow(0.01, timeElapsed);

            this.currentPosition_.lerp(idealOffset, t1);

            this.camera_.position.copy(this.currentPosition_);
            this.camera_.quaternion.slerp(this.params_.target.Quaternion, t2);
        }
    }

    return {
        ThirdPersonCamera: ThirdPersonCamera,
    };
})();
